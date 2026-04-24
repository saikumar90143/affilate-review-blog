import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export const runtime = 'edge';

// Font configuration
// Automatically fetching Inter font from Google
const interMedium = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEWUvw.woff2', import.meta.url)
).then((res) => res.arrayBuffer());

const interBlack = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEWUvw.woff2', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const slug1 = searchParams.get('slug1');
    const slug2 = searchParams.get('slug2');

    // Make sure we have dual fonts
    const [mediumFont, blackFont] = await Promise.all([interMedium, interBlack]);

    if (type === 'versus' && slug1 && slug2) {
      await connectToDatabase();
      
      const [p1, p2] = await Promise.all([
        Product.findOne({ slug: slug1 }).lean(),
        Product.findOne({ slug: slug2 }).lean()
      ]);

      if (p1 && p2) {
        return new ImageResponse(
          (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#050505',
                backgroundImage: 'linear-gradient(135deg, #050505 0%, #0d0d12 100%)',
                color: 'white',
              }}
            >
              {/* Top Bar */}
              <div style={{ display: 'flex', position: 'absolute', top: 40, width: '100%', justifyContent: 'center' }}>
                 <div style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '10px 30px', borderRadius: '40px', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                   Elite Reviews Intelligence
                 </div>
              </div>

              {/* Main Battle Arena */}
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '0 100px', marginTop: 40 }}>
                {/* Product 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '400px' }}>
                   <div style={{ width: 300, height: 300, background: 'white', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '8px solid rgba(255,255,255,0.1)' }}>
                      <img src={p1.image} alt={p1.title} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                   </div>
                   <h2 style={{ fontSize: 36, fontWeight: 900, textAlign: 'center', marginTop: 30 }}>{p1.title}</h2>
                   <div style={{ fontSize: 40, fontWeight: 900, color: '#facc15', marginTop: 10 }}>{p1.rating}/5</div>
                </div>

                {/* VS Badge */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 150, 
                  height: 150, 
                  borderRadius: 100, 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                  fontSize: 60,
                  fontWeight: 900,
                  border: '10px solid #050505',
                  zIndex: 10
                }}>
                  VS
                </div>

                {/* Product 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '400px' }}>
                   <div style={{ width: 300, height: 300, background: 'white', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '8px solid rgba(255,255,255,0.1)' }}>
                      <img src={p2.image} alt={p2.title} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                   </div>
                   <h2 style={{ fontSize: 36, fontWeight: 900, textAlign: 'center', marginTop: 30 }}>{p2.title}</h2>
                   <div style={{ fontSize: 40, fontWeight: 900, color: '#facc15', marginTop: 10 }}>{p2.rating}/5</div>
                </div>
              </div>
            </div>
          ),
          {
            width: 1200,
            height: 630,
            fonts: [
              { name: 'Inter', data: mediumFont, style: 'normal', weight: 500 },
              { name: 'Inter', data: blackFont, style: 'normal', weight: 900 },
            ],
          }
        );
      }
    }

    // Default Fallback
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
          <h1 style={{ fontSize: 100, color: 'white', fontWeight: 900 }}>EliteReviews</h1>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
