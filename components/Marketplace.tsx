import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Briefcase, MapPin, DollarSign, Clock, Star, TrendingUp, Users, Filter, Wrench } from 'lucide-react';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, PageHeader, ActionButton } from './shared';

export function Marketplace() {
  const stats = [
    {
      title: 'Available Jobs',
      value: '48',
      change: '+12 posted today',
      icon: Briefcase,
      trend: 'up' as const
    },
    {
      title: 'Active Bids',
      value: '15',
      change: 'Awaiting responses',
      icon: Clock
    },
    {
      title: 'Jobs Won',
      value: '142',
      change: '+18% win rate',
      icon: TrendingUp,
      trend: 'up' as const
    },
    {
      title: 'Vendor Rating',
      value: '4.8/5.0',
      change: 'Based on 89 reviews',
      icon: Star
    }
  ];

  const weeklyJobs = [
    { day: 'Mon', jobs: 8 },
    { day: 'Tue', jobs: 12 },
    { day: 'Wed', jobs: 10 },
    { day: 'Thu', jobs: 15 },
    { day: 'Fri', jobs: 18 },
    { day: 'Sat', jobs: 6 },
    { day: 'Sun', jobs: 4 }
  ];

  const availableJobs = [
    {
      id: 'MKT-892',
      title: 'Emergency Plumbing Repair',
      client: 'Sunset Property Group',
      property: 'Oceanview Apartments',
      location: 'Santa Monica, CA',
      description: 'Urgent pipe leak in unit 204. Need immediate response.',
      category: 'Plumbing',
      budget: '$500 - $800',
      urgency: 'Urgent',
      posted: '2 hours ago',
      proposals: 8,
      rating: 4.7
    },
    {
      id: 'MKT-891',
      title: 'HVAC System Installation',
      client: 'Metro Property Management',
      property: 'Downtown Business Center',
      location: 'Los Angeles, CA',
      description: 'Install new commercial HVAC system for 5,000 sq ft office space.',
      category: 'HVAC',
      budget: '$8,000 - $12,000',
      urgency: 'High',
      posted: '5 hours ago',
      proposals: 15,
      rating: 4.9
    },
    {
      id: 'MKT-890',
      title: 'Interior Painting - Multiple Units',
      client: 'Coastal Realty LLC',
      property: 'Beachside Condos',
      location: 'Venice Beach, CA',
      description: 'Paint 8 residential units. Include walls, ceilings, and trim.',
      category: 'Painting',
      budget: '$4,500 - $6,000',
      urgency: 'Medium',
      posted: '8 hours ago',
      proposals: 22,
      rating: 4.5
    }
  ];

  const myBids = [
    {
      jobId: 'MKT-885',
      title: 'Kitchen Appliance Installation',
      client: 'Prime Realty Group',
      myBid: 1200,
      competitors: 9,
      status: 'Under Review',
      submittedDate: '2025-11-06',
      probability: 65
    },
    {
      jobId: 'MKT-882',
      title: 'Roof Leak Repair',
      client: 'Skyline Properties',
      myBid: 2800,
      competitors: 14,
      status: 'Shortlisted',
      submittedDate: '2025-11-05',
      probability: 85
    },
    {
      jobId: 'MKT-878',
      title: 'Bathroom Renovation',
      client: 'Luxury Living Corp',
      myBid: 5500,
      competitors: 12,
      status: 'Under Review',
      submittedDate: '2025-11-04',
      probability: 55
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'Urgent': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PageHeader 
        description="Discover new job opportunities and grow your business."
        actions={<ActionButton icon={Briefcase} variant="primary">My Bids</ActionButton>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Weekly Jobs Chart & My Bids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">New Jobs Posted This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyJobs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`${value}`, 'Jobs Posted']}
                />
                <Bar dataKey="jobs" fill="#FBBF24" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">My Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myBids.map((bid) => (
                <div key={bid.jobId} className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-medium">{bid.title}</p>
                      <p className="text-gray-500 text-xs">${bid.myBid.toLocaleString()}</p>
                    </div>
                    <Badge variant={bid.status === 'Shortlisted' ? 'default' : 'secondary'} className="text-xs px-1.5 py-0.5">
                      {bid.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{bid.competitors} competitors</span>
                    <span className="text-green-600">{bid.probability}% win chance</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${bid.probability}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Jobs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 text-base font-semibold leading-tight">Available Jobs</CardTitle>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm">
                <option>All Categories</option>
                <option>Plumbing</option>
                <option>HVAC</option>
                <option>Electrical</option>
                <option>Painting</option>
              </select>
              <button className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableJobs.map((job) => (
              <div key={job.id} className="p-3.5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wrench className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <h3 className="text-gray-900 text-sm font-semibold leading-tight">{job.title}</h3>
                      <span className={`px-1.5 py-0.5 rounded-lg text-xs leading-none ${getUrgencyColor(job.urgency)}`}>
                        {job.urgency}
                      </span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 leading-none">{job.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2 text-xs leading-relaxed">{job.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-start gap-1.5 text-gray-500">
                        <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 leading-normal">Client</p>
                          <p className="text-gray-900 text-xs font-medium truncate leading-tight mt-0.5">{job.client}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs leading-normal">{job.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 leading-normal">Location</p>
                          <p className="text-gray-900 text-xs font-medium truncate leading-tight mt-0.5">{job.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5 text-gray-500">
                        <DollarSign className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 leading-normal">Budget</p>
                          <p className="text-gray-900 text-xs font-medium leading-tight mt-0.5">{job.budget}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 leading-normal">Posted</p>
                          <p className="text-gray-900 text-xs font-medium leading-tight mt-0.5">{job.posted}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                  <p className="text-gray-500 text-xs">{job.proposals} proposals submitted</p>
                  <div className="flex gap-1.5">
                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium">
                      View Details
                    </button>
                    <button className="px-3 py-1.5 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-xs font-medium">
                      Submit Proposal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
