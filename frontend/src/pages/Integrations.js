import { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';
import Sidebar from '@/components/Sidebar';
import { Sheet, FileText, MessageSquare, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const iconMap = {
  'Sheet': Sheet,
  'FileText': FileText,
  'MessageSquare': MessageSquare,
  'Users': Users,
  'CreditCard': CreditCard
};

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await axios.get(`${API}/integrations`);
      setIntegrations(response.data);
    } catch (error) {
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (integrationId, currentState) => {
    try {
      await axios.post(`${API}/integrations/${integrationId}/toggle`);
      setIntegrations(prev =>
        prev.map(int =>
          int.id === integrationId ? { ...int, connected: !currentState } : int
        )
      );
      toast.success('Integration updated');
    } catch (error) {
      toast.error('Failed to update integration');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-2" data-testid="integrations-title">
              Integrations
            </h1>
            <p className="text-base text-slate-600">Connect your data sources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => {
              const IconComponent = iconMap[integration.icon] || FileText;
              return (
                <div
                  key={integration.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  data-testid={`integration-card-${integration.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{integration.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className={`text-sm font-medium ${integration.connected ? 'text-green-600' : 'text-slate-500'}`}>
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </span>
                    <Switch
                      checked={integration.connected}
                      onCheckedChange={() => handleToggle(integration.id, integration.connected)}
                      data-testid={`integration-toggle-${integration.id}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
