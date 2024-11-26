import { Text, styled } from "tamagui";
import { TaskCard } from "./TaskCard";
import { Id } from "@/convex/_generated/dataModel";
import { SectionList } from "react-native";

interface Task {
  _id: Id<"tasks">;
  title: string;
  notes: string;
  isCompleted: boolean;
  courseColor: string;
  courseCode: string;
  dueDate: number;
}

interface TaskListProps {
  tasks: Task[];
}

interface Section {
  title: string;
  data: Task[];
}

const SectionHeaderText = styled(Text, {
  fontSize: "$5",
  fontWeight: "500",
  paddingHorizontal: "$3",
  paddingVertical: "$2",
  backgroundColor: "$background",
});

function formatDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.getTime() === today.getTime()) {
    return "Today";
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  return taskDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function SectionHeader({ title }: { title: string }) {
  return <SectionHeaderText>{title}</SectionHeaderText>;
}

export function TaskList({ tasks }: TaskListProps) {
  // Transform tasks into sections
  const sections: Section[] = tasks.reduce((acc: Section[], task) => {
    const date = new Date(task.dueDate);
    date.setHours(0, 0, 0, 0);
    const dateStr = formatDate(date);

    const existingSection = acc.find((section) => section.title === dateStr);
    if (existingSection) {
      existingSection.data.push(task);
    } else {
      acc.push({
        title: dateStr,
        data: [task],
      });
    }

    return acc;
  }, []);

  // Sort sections by date
  sections.sort((a, b) => {
    const dateA = new Date(
      tasks.find((task) => formatDate(new Date(task.dueDate)) === a.title)
        ?.dueDate || 0
    );
    const dateB = new Date(
      tasks.find((task) => formatDate(new Date(task.dueDate)) === b.title)
        ?.dueDate || 0
    );
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <SectionList
      sections={sections}
      renderItem={({ item }) => <TaskCard {...item} dueDate={item.dueDate} />}
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeader title={title} />
      )}
      keyExtractor={(item) => item._id.toString()}
      stickySectionHeadersEnabled={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
