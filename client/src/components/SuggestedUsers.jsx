import React from "react";


const suggestedUsers = [
  {
    username: "itz_sameer_khan_7",
    description: "Suggested for you",
    profilePic: "https://via.placeholder.com/40", 
  },
  {
    username: "instagram",
    description: "Popular",
    profilePic: "https://via.placeholder.com/40",
    verified: true,
  },
  {
    username: "thakurakash.singh_3...",
    description: "Followed by anurag_tiwari_01",
    profilePic: "https://via.placeholder.com/40",
  },
  {
    username: "rishabh_thakur_05",
    description: "Followed by anurag_tiwari_01",
    profilePic: "https://via.placeholder.com/40",
  },
  {
    username: "kapilkaushik4",
    description: "Followed by prsingh0310",
    profilePic: "https://via.placeholder.com/40",
  },
];

const SuggestedUsers = () => {
  return (
    <div className=" card bg-gray-900 text-white p-4 rounded-lg max-w-sm mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
          <span className="font-semibold">sandeep_necoder</span>
        </div>
        <button className="text-blue-500 font-semibold">Switch</button>
      </div>

      {/* Suggested for you section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-400">Suggested for you</h2>
        <button className="text-blue-500 text-sm font-semibold">See All</button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePic}
                alt={`${user.username} profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold">{user.username}</span>
                  {user.verified && (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-400">{user.description}</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-semibold">Follow</button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-xs text-gray-500">
        <p>
          About • Help • Press • API • Jobs • Privacy • Terms • Locations •
          Language • Meta Verified
        </p>
        <p className="mt-2">© 2025 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

export default SuggestedUsers;