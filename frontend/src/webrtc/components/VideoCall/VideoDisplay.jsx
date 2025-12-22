import { useEffect, useRef } from 'react';

/**
 * VideoDisplay Component
 * Displays video stream with participant name and status indicators
 */
const VideoDisplay = ({ stream, name, isMain = false, cameraOff = false, isMuted = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const width = isMain ? 'w-full' : 'w-64';
    const height = isMain ? 'h-full' : 'h-48';

    return (
        <div className={`relative ${width} ${height} bg-gray-900 rounded-xl overflow-hidden`}>
            {!cameraOff && stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={!isMain} // Mute own video to prevent echo
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-white">
                                {name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Camera is off</p>
                    </div>
                </div>
            )}

            {/* Name label */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="text-white text-sm font-medium">{name || 'Unknown'}</span>
                {isMuted && (
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        </div>
    );
};

export default VideoDisplay;
