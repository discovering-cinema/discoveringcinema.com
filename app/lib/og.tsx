import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const alt = 'Discovering Cinema';

interface OGImageData {
  title: string;
  subtitle?: string;
  label?: string;
  image?: string;
}

function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
  };

  return text.replace(/&[a-z0-9#]+;/gi, (entity) => {
    if (entities[entity]) return entities[entity];
    if (entity.startsWith('&#')) {
      const code = entity.startsWith('&#x')
        ? parseInt(entity.slice(3, -1), 16)
        : parseInt(entity.slice(2, -1), 10);
      if (!isNaN(code)) return String.fromCharCode(code);
    }
    return entity;
  });
}

export async function generateOGImage({
  title,
  subtitle,
  label,
  image,
}: OGImageData) {
  // Try to load fonts from a reliable CDN
  const [playfairData, loraData, montserratData] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/l/font?kit=nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiunDXbtc&skey=f3b68f0152604ed9&v=v40',
    ).then((res) => (res.ok ? res.arrayBuffer() : null)),
    fetch(
      'https://fonts.gstatic.com/l/font?kit=0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkqk&skey=1d294b6d956fb8e&v=v37',
    ).then((res) => (res.ok ? res.arrayBuffer() : null)),
    fetch(
      'https://fonts.gstatic.com/l/font?kit=JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aX4&skey=7bc19f711c0de8f&v=v31',
    ).then((res) => (res.ok ? res.arrayBuffer() : null)),
  ]).catch((err) => {
    console.error('Error loading fonts for OG image:', err);
    return [null, null, null];
  });

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style?: 'normal' | 'italic';
  }[] = [];
  if (playfairData) {
    fonts.push({
      name: 'Playfair Display',
      data: playfairData,
      weight: 700,
      style: 'normal',
    });
  }
  if (loraData) {
    fonts.push({
      name: 'Lora',
      data: loraData,
      weight: 400,
      style: 'normal',
    });
  }
  if (montserratData) {
    fonts.push({
      name: 'Montserrat',
      data: montserratData,
      weight: 500,
      style: 'normal',
    });
  }

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#F9F8F4', // Parchment
        padding: '80px',
        position: 'relative',
      }}
    >
      {/* Background Image if provided */}
      {image && (
        <img
          src={`https://discoveringcinema.com${image}`}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.1, // Slightly reduced for better text legibility
          }}
        />
      )}
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12px',
          backgroundColor: '#D6402B', // Director's Red
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '900px',
        }}
      >
        {label && (
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#D6402B', // Director's Red
              marginBottom: '8px',
              fontFamily: montserratData ? 'Montserrat' : 'sans-serif',
            }}
          >
            {decodeHtmlEntities(label)}
          </div>
        )}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#2C313B', // Deep Ink
            fontFamily: playfairData ? 'Playfair Display' : 'serif',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}
        >
          {decodeHtmlEntities(title)}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '36px',
              color: '#2C313B', // Deep Ink
              opacity: 0.9,
              marginTop: '12px',
              lineHeight: 1.3,
              fontFamily: loraData ? 'Lora' : 'serif',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
            }}
          >
            {decodeHtmlEntities(subtitle)}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '2px',
            backgroundColor: '#D6402B',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#736B5E', // Warm Slate
              marginBottom: '4px',
              fontFamily: montserratData ? 'Montserrat' : 'sans-serif',
            }}
          >
            Discovering
          </span>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#2C313B',
              fontFamily: playfairData ? 'Playfair Display' : 'serif',
            }}
          >
            Cinema
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  );
}
