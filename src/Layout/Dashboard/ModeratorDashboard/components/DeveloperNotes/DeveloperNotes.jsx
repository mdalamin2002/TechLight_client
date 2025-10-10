import React from "react";

const DeveloperNotes = () => {
  const notes = [
    {
      title: "Security & Access",
      description: "All routes under /moderator must be secured and only accessible to users with the Moderator role.",
    },
    {
      title: "Action Privileges",
      description: "Moderators have restricted permissions for sensitive actions:",
      items: [
        "Permanent Ban: Reserved for Admins only.",
        "Product Deletion: Reserved for Admins only.",
      ],
    },
    {
      title: "Logging",
      description: "All moderator actions (e.g., approving a product, issuing a warning) must be logged to provide a clear audit trail.",
    },
    {
      title: "Notifications",
      description: "Notifications should be handled by a messaging or queue system to ensure reliability and scalability.",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Developer Notes</h1>
      <div className="space-y-4">
        {notes.map((note, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h2>
            <p className="text-gray-700 mb-2">{note.description}</p>
            {note.items && (
              <ul className="list-disc list-inside text-gray-700">
                {note.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperNotes;
