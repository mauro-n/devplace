import { ChevronLeft, ChevronRight, Clock, Grid3X3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

function Sidebar({ onNavigate, isCollapsed, onToggleCollapse }: any) {
  const navigate = useNavigate()
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1] || 'matrix';

  const menuItems = [
    {
      id: 'matrix',
      label: 'Matrix',
      icon: Grid3X3,
      path: '/',
      description: 'Eisenhower Matrix'
    },
    {
      id: 'pomodoro',
      label: 'Pomodoro',
      icon: Clock,
      path: '/pomodoro',
      description: 'Focus Timer'
    }
  ];

  return (
    <div className={`bg-white h-full border-r w-full border-gray-200 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Productivity</h1>
            <p className="text-xs text-gray-500">Focus & Organization</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                )}
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed ? (
          <div className="text-xs text-gray-400 text-center">
            v1.0.0
          </div>
        ) : (
          <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;