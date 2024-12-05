import { createContext, useContext, useState } from 'react';

type StudyProfileData = {
  major?: string;
  year?: string;
  courses?: string[];
  studyPreferences?: {
    timeOfDay?: string[];
    location?: string[];
  };
};

type StudyProfileContextType = {
  profileData: StudyProfileData;
  updateProfileData: (data: Partial<StudyProfileData>) => void;
};

const StudyProfileContext = createContext<StudyProfileContextType | undefined>(undefined);

export function StudyProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileData, setProfileData] = useState<StudyProfileData>({});

  const updateProfileData = (data: Partial<StudyProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  return (
    <StudyProfileContext.Provider value={{ profileData, updateProfileData }}>
      {children}
    </StudyProfileContext.Provider>
  );
}

export function useStudyProfile() {
  const context = useContext(StudyProfileContext);
  if (context === undefined) {
    throw new Error('useStudyProfile must be used within a StudyProfileProvider');
  }
  return context;
}
