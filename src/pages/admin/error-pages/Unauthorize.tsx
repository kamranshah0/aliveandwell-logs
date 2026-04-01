

const UnAuthorize: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">403</h1>
        <p className="text-xl text-gray-600 mt-4">Access Denied</p>
        <p className="text-gray-500 mt-2">You don't have permission to access this page.</p>
      </div>
    </div>
  );
};

export default UnAuthorize;