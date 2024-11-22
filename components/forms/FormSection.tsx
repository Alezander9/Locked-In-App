import { Stack, Text, styled } from "tamagui";

const SectionContainer = styled(Stack, {
  marginBottom: 20,
});

const SectionTitle = styled(Text, {
  fontSize: 13,
  color: "$gray",
  paddingHorizontal: 16,
  paddingVertical: 6,
  textTransform: "uppercase",
});

const SectionContent = styled(Stack, {
  backgroundColor: "$bg",
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: "$borderColor",
});

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <SectionContainer>
      {title && <SectionTitle>{title}</SectionTitle>}
      <SectionContent>{children}</SectionContent>
    </SectionContainer>
  );
};
