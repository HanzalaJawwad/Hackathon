
import { AttendanceProvider } from "@/context/AttendanceContext";
import Dashboard from "@/components/Dashboard";
import ChatBot from "@/components/ChatBot";
import RegisteredStudents from "@/components/RegisteredStudents";

const Index = () => {
  return (
    <AttendanceProvider>
      <div className="min-h-screen bg-slate-50">
        <Dashboard />
        <div className="container mx-auto py-6">
          <RegisteredStudents />
        </div>
        <ChatBot />
      </div>
    </AttendanceProvider>
  );
};

export default Index;
