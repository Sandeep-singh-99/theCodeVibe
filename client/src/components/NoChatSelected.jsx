import React from "react";
import { MessageSquare } from "lucide-react";

export default function NoChatSelected() {
  return (
    <section
      className="flex-1 flex flex-col items-center justify-center p-6 bg-base-100 transition-all duration-300"
      aria-label="No chat selected"
    >
      <div className="max-w-md text-center space-y-6 animate-fade-in">
        {/* Icon Display */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div
              className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-base-content">
          Welcome to Chatty!
        </h2>
        <p className="text-base-content/70">
          Select a conversation from the sidebar or start a new one.
        </p>

        {/* Call to Action */}
        <button className="btn btn-primary btn-sm mt-4">
          Start New Chat
        </button>
      </div>
    </section>
  );
}