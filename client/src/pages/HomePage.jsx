import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage({ onLogout, user }) {
  const containerRef = React.useRef(null);
  const [positionStyle, setPositionStyle] = React.useState({ left: 0, top: 0, width: undefined, height: undefined });
  const [blankPaperPositionStyle, setBlankPaperPositionStyle] = React.useState({ left: 0, top: 0, width: undefined, height: undefined });
  const navigate = useNavigate();
  React.useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const bgImg = new Image();
    bgImg.src = '/textures/HomeBackground.png';

    const overlayImg = new Image();
    overlayImg.src = '/textures/SelectedStack.png';

    const blankPaperImg = new Image();
    blankPaperImg.src = '/textures/SelectedBlankPaper.png';

    function updatePosition() {
      if (!containerRef.current || !bgImg.naturalWidth || !bgImg.naturalHeight) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const scale = Math.max(
        containerWidth / bgImg.naturalWidth,
        containerHeight / bgImg.naturalHeight
      );

      const renderedWidth = bgImg.naturalWidth * scale;
      const renderedHeight = bgImg.naturalHeight * scale;

      const offsetX = (containerWidth - renderedWidth) / 2;
      const offsetY = (containerHeight - renderedHeight) / 2;

      const anchorX = 228;
      const anchorY = 198;

      const left = Math.round(offsetX + anchorX * scale);
      const top = Math.round(offsetY + anchorY * scale);

      let width;
      let height;
      if (overlayImg.naturalWidth && overlayImg.naturalHeight) {
        const overlayScaleFactor = 0.23;
        width = Math.round(overlayImg.naturalWidth * scale * overlayScaleFactor);
        height = Math.round(overlayImg.naturalHeight * scale * overlayScaleFactor);
      }

      setPositionStyle({ left, top, width, height });

      // Calculate position for blank paper
      const blankPaperAnchorX = 538;
      const blankPaperAnchorY = 271;

      const blankPaperLeft = Math.round(offsetX + blankPaperAnchorX * scale);
      const blankPaperTop = Math.round(offsetY + blankPaperAnchorY * scale);

      let blankPaperWidth;
      let blankPaperHeight;
      if (blankPaperImg.naturalWidth && blankPaperImg.naturalHeight) {
        const blankPaperScaleFactor = 0.58;
        blankPaperWidth = Math.round(blankPaperImg.naturalWidth * scale * blankPaperScaleFactor);
        blankPaperHeight = Math.round(blankPaperImg.naturalHeight * scale * blankPaperScaleFactor);
      }

      setBlankPaperPositionStyle({ left: blankPaperLeft, top: blankPaperTop, width: blankPaperWidth, height: blankPaperHeight });
    }

    const onLoadAndResize = () => updatePosition();
    bgImg.onload = onLoadAndResize;
    overlayImg.onload = onLoadAndResize;
    blankPaperImg.onload = onLoadAndResize;

    updatePosition();
    window.addEventListener('resize', onLoadAndResize);
    return () => {
      window.removeEventListener('resize', onLoadAndResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="home">
      {/* User info and logout button */}
      {user && (
        <div className="user-info-bar">
          <div className="user-info">
            <img
              src={user.user_metadata?.avatar_url || user.user_metadata?.picture || '/default-avatar.png'}
              alt={user.user_metadata?.full_name || user.user_metadata?.name || user.email}
              className="user-avatar"
            />
            <span className="user-name">
              Welcome, {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
            </span>
          </div>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}

      <div
        className="selected-stack-wrap"
        style={{
          position: 'absolute',
          left: positionStyle.left,
          top: positionStyle.top,
          width: positionStyle.width,
          height: positionStyle.height,
          zIndex: 50,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/view/dumb-letter')}
      >
        <img
          className="selected-stack"
          src="/textures/SelectedStack.png"
          alt="Selected Stack"
          style={{
            width: '100%',
            height: '100%'
          }}
        />
        <div className="selected-stack-label">view letters</div>
      </div>

      <div
        className="selected-blank-paper-wrap"
        style={{
          position: 'absolute',
          left: blankPaperPositionStyle.left,
          top: blankPaperPositionStyle.top,
          width: blankPaperPositionStyle.width,
          height: blankPaperPositionStyle.height,
          zIndex: 50,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/write/letter')}
      >
        <img
          className="selected-blank-paper"
          src="/textures/SelectedBlankPaper.png"
          alt="Selected Blank Paper"
          style={{
            width: '100%',
            height: '100%'
          }}
        />
        <div className="selected-blank-paper-label">write letter</div>
      </div>
    </div>
  );
}


