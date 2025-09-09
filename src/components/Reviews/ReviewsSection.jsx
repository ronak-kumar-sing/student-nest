"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  ThumbsUp,
  Flag
} from 'lucide-react'
import ShinyText from '../TextAnimations/ShinyText'

// Individual Review Item Component
const ReviewItem = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHelpful, setIsHelpful] = useState(false)
  const maxLength = 150

  const shouldTruncate = review.comment.length > maxLength
  const displayComment = shouldTruncate && !isExpanded
    ? review.comment.slice(0, maxLength) + '...'
    : review.comment

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-zinc-800 pb-6 last:border-b-0"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-white flex items-center gap-2">
              {review.userName}
              {review.verified && (
                <div className="flex items-center gap-1 bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs border border-green-700">
                  <CheckCircle className="w-3 h-3" />
                  Verified Stay
                </div>
              )}
            </div>
            <div className="text-sm text-zinc-500 flex items-center gap-2">
              <span>{review.date}</span>
              {review.stayDuration && (
                <>
                  <span>•</span>
                  <span>Stayed for {review.stayDuration}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-zinc-600'
                  }`}
              />
            ))}
          </div>
          <div className="text-xs text-zinc-500">
            {review.rating === 5 && 'Excellent'}
            {review.rating === 4 && 'Very Good'}
            {review.rating === 3 && 'Good'}
            {review.rating === 2 && 'Fair'}
            {review.rating === 1 && 'Poor'}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
          {displayComment}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Review Categories */}
      {review.categories && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(review.categories).map(([category, rating]) => (
            <div
              key={category}
              className="bg-zinc-800 px-3 py-1 rounded-full text-xs border border-zinc-700"
            >
              <span className="text-zinc-400 capitalize">{category}:</span>
              <span className="text-white ml-1">{rating}/5</span>
            </div>
          ))}
        </div>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-zinc-700"
            />
          ))}
        </div>
      )}

      {/* Review Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsHelpful(!isHelpful)}
            className={`flex items-center gap-1 text-sm transition-colors ${isHelpful
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-zinc-500 hover:text-zinc-400'
              }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
            <span>Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}</span>
          </button>

          <button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-400 transition-colors">
            <Flag className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>

        {review.ownerResponse && (
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View Owner Response
          </button>
        )}
      </div>

      {/* Owner Response */}
      {review.ownerResponse && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 bg-zinc-800 rounded-xl p-4 border border-zinc-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              O
            </div>
            <span className="text-sm font-medium text-green-400">Property Owner</span>
            <span className="text-xs text-zinc-500">{review.ownerResponse.date}</span>
          </div>
          <p className="text-zinc-300 text-sm">{review.ownerResponse.message}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

// Write Review Modal Component
const WriteReviewModal = ({ room, isOpen, onClose, onReviewSubmit }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [categories, setCategories] = useState({
    cleanliness: 0,
    location: 0,
    facilities: 0,
    owner: 0,
    value: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categoryLabels = {
    cleanliness: 'Cleanliness',
    location: 'Location',
    facilities: 'Facilities',
    owner: 'Owner/Host',
    value: 'Value for Money'
  }

  const showToast = (message, type) => {
    // Simple alert for now - can be replaced with toast library
    alert(message)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      showToast('Please select an overall rating', 'error')
      return
    }

    if (comment.trim().length < 10) {
      showToast('Please write at least 10 characters for your review', 'error')
      return
    }

    const unratedCategories = Object.entries(categories).filter(([_, rating]) => rating === 0)
    if (unratedCategories.length > 0) {
      showToast('Please rate all categories', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newReview = {
        id: Date.now(),
        userName: 'You',
        rating: rating,
        date: 'Just now',
        comment: comment.trim(),
        verified: false,
        categories: categories,
        helpfulCount: 0,
        stayDuration: null
      }

      onReviewSubmit(newReview)
      showToast('Review submitted successfully!', 'success')

      // Reset form
      setRating(0)
      setComment('')
      setCategories({
        cleanliness: 0,
        location: 0,
        facilities: 0,
        owner: 0,
        value: 0
      })
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
      showToast('Failed to submit review. Please try again.', 'error')
    }

    setIsSubmitting(false)
  }

  const handleStarClick = (starRating) => {
    setRating(starRating)
  }

  const handleCategoryRating = (category, categoryRating) => {
    setCategories(prev => ({
      ...prev,
      [category]: categoryRating
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-zinc-900 rounded-2xl p-6 max-w-2xl w-full border border-zinc-700 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Write a Review
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-sm text-zinc-400 mb-2">Reviewing</div>
          <div className="text-white font-medium">{room.title}</div>
          <div className="text-sm text-zinc-500">{room.location.address}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-zinc-600 hover:text-zinc-500'
                      }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-medium text-white">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <label className="block text-sm font-medium text-white mb-4">
              Rate Specific Aspects *
            </label>
            <div className="space-y-4">
              {Object.entries(categoryLabels).map(([category, label]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-zinc-300 text-sm">{label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleCategoryRating(category, star)}
                        className="transition-all hover:scale-105"
                      >
                        <Star
                          className={`w-5 h-5 ${star <= categories[category]
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-zinc-600 hover:text-zinc-500'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Write your review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this property..."
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-3 border border-zinc-700 bg-zinc-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
            />
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-zinc-500">Minimum 10 characters</span>
              <span className="text-zinc-500">{comment.length}/1000</span>
            </div>
          </div>

          {/* Review Guidelines */}
          <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
            <h4 className="text-sm font-medium text-white mb-2">Review Guidelines</h4>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on your experience with the property</li>
              <li>• Avoid personal information or inappropriate content</li>
              <li>• Help other students make informed decisions</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-zinc-600 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Main Reviews Section Component
const ReviewsSection = ({ reviews, rating, totalReviews, room, onReviewSubmit }) => {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  // Filter reviews
  const filteredReviews = sortedReviews.filter(review => {
    if (filterBy === 'all') return true
    if (filterBy === 'verified') return review.verified
    if (filterBy === '5star') return review.rating === 5
    if (filterBy === '4star') return review.rating === 4
    if (filterBy === '3star') return review.rating === 3
    if (filterBy === 'lowstar') return review.rating <= 2
    return true
  })

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)

  // Rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">
          Reviews & Ratings
        </h3>
        <button
          onClick={() => setShowWriteReview(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <ShinyText text="Write a Review" speed={3} className="font-medium" />
        </button>
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">{rating}</div>
            <div className="flex items-center gap-1 mb-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-zinc-600'
                    }`}
                />
              ))}
            </div>
            <div className="text-zinc-400">{totalReviews} reviews</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-zinc-400 w-6">{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-zinc-400 w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Filter:</span>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="verified">Verified Only</option>
            <option value="5star">5 Stars</option>
            <option value="4star">4 Stars</option>
            <option value="3star">3 Stars</option>
            <option value="lowstar">1-2 Stars</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {displayedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </AnimatePresence>

        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-zinc-400">No reviews match the selected filters.</p>
          </div>
        )}

        {filteredReviews.length > 3 && (
          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-zinc-700 flex items-center gap-2 mx-auto"
            >
              {showAllReviews ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less Reviews
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View More Reviews ({filteredReviews.length - 3} more)
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        room={room}
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onReviewSubmit={onReviewSubmit}
      />
    </div>
  )
}

export default ReviewsSection
