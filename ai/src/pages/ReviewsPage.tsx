import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, User, Calendar, CheckCircle, Plus, Filter, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  text: string;
  is_verified: boolean;
  created_at: string;
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    user_name: '',
    rating: 5,
    text: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (e) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', formData);
      toast.success("Review submitted successfully!");
      setIsModalOpen(false);
      fetchReviews();
      setFormData({ user_name: '', rating: 5, text: '' });
    } catch (e) {
      toast.error("Failed to submit review");
    }
  };

  const filteredReviews = filter === 0 
    ? reviews 
    : reviews.filter(r => r.rating === filter);

  const stats = {
    rating: 4.9,
    count: '2,400+'
  };

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold text-gradient-gold mb-4"
          >
            User Experiences
          </motion.h1>
          <div className="flex items-center justify-center gap-4 text-white/60">
            <div className="flex items-center gap-1 text-neon-gold">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <span className="text-xl font-bold text-white">{stats.rating}/5 Rating</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{stats.count} Reviews</span>
          </div>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2 glass p-1 rounded-full border-white/10">
            {[0, 5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setFilter(star)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === star ? 'bg-neon-blue text-dark-base' : 'text-white/60 hover:text-white'
                }`}
              >
                {star === 0 ? 'All' : `${star}★`}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Review
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass h-64 animate-pulse border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass p-8 flex flex-col gap-4 border-white/10 group hover:border-neon-blue/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-gold to-neon-blue flex items-center justify-center font-bold text-dark-base">
                        {review.user_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{review.user_name}</h4>
                        <p className="text-[10px] text-white/40">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-neon-gold fill-current' : 'text-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed italic">"{review.text}"</p>
                  {review.is_verified && (
                    <div className="flex items-center gap-1 text-[10px] text-neon-blue font-bold uppercase tracking-widest mt-auto">
                      <CheckCircle className="w-3 h-3" /> Verified User
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-dark-base/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 border-white/10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif font-bold mb-6">Share Your Experience</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-white/40 mb-2">Your Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.user_name}
                    onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-blue/50 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-white/40 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={`p-2 rounded-lg transition-colors ${
                          formData.rating >= star ? 'text-neon-gold' : 'text-white/10'
                        }`}
                      >
                        <Star className={`w-8 h-8 ${formData.rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-white/40 mb-2">Review Text</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-blue/50 outline-none resize-none"
                    placeholder="How did Apna-Lawyer help you?"
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-4">Submit Review</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsPage;
