export interface ModeratorNote {
  id: string;
  contentId: string;
  moderator: {
    id: string;
    name: string;
    avatar?: string;
  };
  note: string;
  createdAt: string;
}

export const moderatorNotes: ModeratorNote[] = [
  {
    id: "note-1",
    contentId: "content-1",
    moderator: {
      id: "mod-1",
      name: "John Doe",
      avatar: "",
    },
    note: "Content reviewed and flagged for further investigation. The user has previous violations.",
    createdAt: "2023-05-15T12:30:00Z",
  },
  {
    id: "note-2",
    contentId: "content-1",
    moderator: {
      id: "mod-2",
      name: "Alice Smith",
      avatar: "",
    },
    note: "Initial review completed. Content appears to violate our hate speech policy.",
    createdAt: "2023-05-14T10:15:00Z",
  },
];
