export type JobPosting = {
  id: string;
  logoUrl: string;
  title: string;
  orgName: string;
  opType: string;
  image: string;
  description: string;
  location: string[];
  categories: string[];
};

export type CardProps = {
  job_post: {
    id: string;
    title: string;
    orgName: string;
    opType: string;
    logoUrl: string;
    description: string;
    locations: string[];
    categories: string[];
    isBookmarked: boolean;
    token: string;
  };
  token: string;
  refetch: () => void;
  setIsPopUp: (value: boolean) => void;
};

export type BookmarkCardProps = {
  title: string;
  orgName: string;
  opType: string;
  location: string;
  logoUrl: string;
  eventID: string;
  datePosted: string;
  dateBookmarked: string;
};

export type userInfoStateType = {
  userInfo: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
};
