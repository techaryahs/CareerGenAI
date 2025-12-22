/**
 * ControlBar Component
 * Bottom control bar with audio, video, end call, chat, and participants buttons
 */
const ControlBar = ({
    isMuted,
    isCameraOn,
    onToggleMute,
    onToggleCamera,
    onEndCall,
    onToggleChat,
    onToggleParticipants,
    chatOpen
}) => {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center justify-center gap-4 shadow-2xl">
            {/* Microphone */}
            <button
                onClick={onToggleMute}
                className={`p-4 rounded-full transition-all ${isMuted
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                )}
            </button>

            {/* Camera */}
            <button
                onClick={onToggleCamera}
                className={`p-4 rounded-full transition-all ${!isCameraOn
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
                {isCameraOn ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                )}
            </button>

            {/* End Call */}
            <button
                onClick={onEndCall}
                className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-lg"
                title="End call"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
            </button>

            {/* Chat */}
            <button
                onClick={onToggleChat}
                className={`p-4 rounded-full transition-all ${chatOpen
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                title="Toggle chat"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {/* Participants */}
            <button
                onClick={onToggleParticipants}
                className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                title="Show participants"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </button>
        </div>
    );
};

export default ControlBar;
