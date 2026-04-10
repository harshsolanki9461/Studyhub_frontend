import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const VideoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get('/materials');
                const v = res.data.find(m => m._id === id);
                if (v) {
                    setVideo(v);
                    await api.post(`/materials/view/${id}`);
                }
            } catch (err) {}
        };
        fetchVideo();
    }, [id]);

    if (!video) return <div className="section">Loading...</div>;

    return (
        <div className="section">
            <div className="page-header">
                <button className="btn btn-ghost btn-sm" style={{marginBottom:'12px'}} onClick={() => navigate('/materials')}>← Back</button>
                <div className="page-title">{video.title}</div>
                <div className="page-subtitle">📘 {video.subject}</div>
            </div>
            
            <div className="video-embed">
                <iframe src={`https://www.youtube.com/embed/${video.videoId}`} allowFullScreen></iframe>
            </div>
            
            <div style={{fontSize:'14px',color:'var(--text2)',lineHeight:'1.6'}}>
                {video.desc}
            </div>
        </div>
    );
};

export default VideoView;
