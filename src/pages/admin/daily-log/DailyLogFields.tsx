import DailyLogFieldsTab from "../settings/DailyLogFieldsTab";
import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";

const DailyLogFields = () => {
  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Form Configuration"
        description="Manage dynamic fields and reporting settings for the Daily Log"
      />
      
      <DailyLogFieldsTab />
    </MainWrapper>
  );
};

export default DailyLogFields;
