const CommentSection = ({ postId }) => {
 
  const comments = [
    { id: 1, username: 'user1', content: 'Great post!', createdAt: '2025-05-12T10:00:00Z' },
    { id: 2, username: 'user2', content: 'Love the media!', createdAt: '2025-05-12T10:05:00Z' },
    { id: 3, username: 'user3', content: 'Nice content!', createdAt: '2025-05-12T10:10:00Z' },
    { id: 4, username: 'user4', content: 'Interesting perspective.', createdAt: '2025-05-12T10:15:00Z' },
    { id: 5, username: 'user5', content: 'I learned something new!', createdAt: '2025-05-12T10:20:00Z' },
    { id: 6, username: 'user6', content: 'Can you elaborate more on this?', createdAt: '2025-05-12T10:25:00Z' },
    { id: 7, username: 'user7', content: 'This is very helpful, thanks!', createdAt: '2025-05-12T10:30:00Z' },
    { id: 8, username: 'user8', content: 'I disagree with your point.', createdAt: '2025-05-12T10:35:00Z' },
    { id: 9, username: 'user9', content: 'What do you think about this?', createdAt: '2025-05-12T10:40:00Z' },
    { id: 10, username: 'user10', content: 'Looking forward to more posts like this!', createdAt: '2025-05-12T10:45:00Z' },
    { id: 11, username: 'user11', content: 'This is a great resource!', createdAt: '2025-05-12T10:50:00Z' },
    { id: 12, username: 'user12', content: 'I have a question about this topic.', createdAt: '2025-05-12T10:55:00Z' },
    { id: 13, username: 'user13', content: 'Can you provide more examples?', createdAt: '2025-05-12T11:00:00Z' },
    { id: 14, username: 'user14', content: 'This is very insightful.', createdAt: '2025-05-12T11:05:00Z' },
    { id: 15, username: 'user15', content: 'I appreciate your effort in writing this.', createdAt: '2025-05-12T11:10:00Z' },
    { id: 16, username: 'user16', content: 'I found this very useful.', createdAt: '2025-05-12T11:15:00Z' },
    { id: 17, username: 'user17', content: 'This is a well-researched article.', createdAt: '2025-05-12T11:20:00Z' },
    { id: 18, username: 'user18', content: 'I would love to see more on this topic.', createdAt: '2025-05-12T11:25:00Z' },
    { id: 19, username: 'user19', content: 'This is a great discussion starter.', createdAt: '2025-05-12T11:30:00Z' },
    { id: 20, username: 'user20', content: 'I have shared this with my friends!', createdAt: '2025-05-12T11:35:00Z' },
    { id: 21, username: 'user21', content: 'I think you missed a point here.', createdAt: '2025-05-12T11:40:00Z' },
    { id: 22, username: 'user22', content: 'This is a great addition to the topic.', createdAt: '2025-05-12T11:45:00Z' },
    { id: 23, username: 'user23', content: 'I would like to hear your thoughts on this.', createdAt: '2025-05-12T11:50:00Z' },
    { id: 24, username: 'user24', content: 'This is a very important issue.', createdAt: '2025-05-12T11:55:00Z' },
    { id: 25, username: 'user25', content: 'I have a different opinion on this.', createdAt: '2025-05-12T12:00:00Z' },
    { id: 26, username: 'user26', content: 'This is a great way to look at it.', createdAt: '2025-05-12T12:05:00Z' },
    { id: 27, username: 'user27', content: 'I think this is a common misconception.', createdAt: '2025-05-12T12:10:00Z' },
   
  ];

  return (
    <div className="w-full h-full p-6 rounded-xl shadow-xl border border-base-100 overflow-hidden">
      <h2 className="text-xl font-semibold text-base-content mb-4">Comments</h2>
      <div className="h-[calc(75%-2.5rem)] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-base-content/60 text-center">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 p-4 bg-base-100 rounded-lg border border-base-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full ring ring-primary/50 ring-offset-base-100 ring-offset-1">
                      <img
                        src="https://via.placeholder.com/32"
                        alt="Commenter"
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-base-content">
                      {comment.username}
                    </span>
                    <span className="text-xs text-base-content/50 block">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-base-content/80">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      {/* Comment Input */}
      <div className="mt-4">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Add a comment..."
        ></textarea>
        <button className="btn bg-white text-black font-semibold mt-2">Post Comment</button>
      </div>
    </div>
  );
};


export default CommentSection;