import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import Analytics from '@/models/Analytics';
import { requireAdmin } from '@/lib/auth';

// POST track event (public)
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { type, path, resourceId } = body;

    if (!type || !path) {
      return NextResponse.json(
        { message: 'Type ve path gerekli' },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get('user-agent') || undefined;
    const referrer = req.headers.get('referer') || undefined;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    await Analytics.create({
      type,
      path,
      resourceId,
      userAgent,
      referrer,
      ip
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json(
      { message: 'Tracking başarısız' },
      { status: 500 }
    );
  }
}

// GET analytics data (admin only)
export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const type = searchParams.get('type');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query: any = {
      createdAt: { $gte: startDate }
    };

    if (type) query.type = type;

    // Get total counts
    const totalViews = await Analytics.countDocuments(query);
    
    // Get unique views (by IP)
    const uniqueViews = await Analytics.distinct('ip', query).then(ips => ips.length);

    // Get views by type
    const viewsByType = await Analytics.aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get top pages
    const topPages = await Analytics.aggregate([
      { $match: query },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get daily views for chart
    const dailyViews = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top referrers
    const topReferrers = await Analytics.aggregate([
      { $match: { ...query, referrer: { $exists: true, $ne: null } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return NextResponse.json({
      totalViews,
      uniqueViews,
      viewsByType,
      topPages,
      dailyViews,
      topReferrers,
      period: `${days} days`
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { message: 'Yetkiniz yok' },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Analytics verisi alınamadı' },
      { status: 500 }
    );
  }
}