import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../api/auth';
import { crmApi } from '../api/crmApi';
import { normalize } from '../utils/formatters';
import { CRM_SEARCH_REFRESH_EVENT } from '../utils/searchEvents';

export default function Topbar() {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchData, setSearchData] = useState({
    customers: [],
    deals: [],
    tasks: []
  });
  const [hasLoadedSearchData, setHasLoadedSearchData] = useState(false);

  const logout = () => {
    authStorage.clearSession();
    navigate('/login', { replace: true });
  };

  const loadSearchData = (force = false) => {
    if (hasLoadedSearchData && !force) return;
    setSearchError('');
    Promise.all([crmApi.customers.list(), crmApi.deals.list(), crmApi.tasks.list()])
      .then(([customers, deals, tasks]) => {
        setSearchData({ customers, deals, tasks });
        setHasLoadedSearchData(true);
      })
      .catch(() => setSearchError('Unable to load search results.'));
  };

  const openNotifications = () => {
    setIsNotificationsOpen((current) => !current);
    loadSearchData();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleSearchRefresh = () => {
      loadSearchData(true);
    };

    window.addEventListener(CRM_SEARCH_REFRESH_EVENT, handleSearchRefresh);
    return () => window.removeEventListener(CRM_SEARCH_REFRESH_EVENT, handleSearchRefresh);
  }, [hasLoadedSearchData]);

  const searchResults = useMemo(() => {
    const search = normalize(query);
    if (search.length < 2) return [];

    const customers = searchData.customers
      .filter((customer) => [customer.name, customer.email, customer.company, customer.phone, customer.country].some((value) => normalize(value).includes(search)))
      .map((customer) => ({
        id: `customer-${customer.id}`,
        title: customer.name,
        subtitle: customer.email || customer.company || 'Customer',
        type: 'Customer',
        path: `/contacts/${customer.id}`
      }));

    const deals = searchData.deals
      .filter((deal) => [deal.name, deal.customerName, deal.ownerName, deal.stage].some((value) => normalize(value).includes(search)))
      .map((deal) => ({
        id: `deal-${deal.id}`,
        title: deal.name,
        subtitle: `${deal.customerName} · ${deal.stage}`,
        type: 'Deal',
        path: '/deals'
      }));

    const tasks = searchData.tasks
      .filter((task) => [task.title, task.customerName, task.userName, task.status].some((value) => normalize(value).includes(search)))
      .map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        subtitle: `${task.customerName} · ${task.status}`,
        type: 'Task',
        path: '/tasks'
      }));

    return [...customers, ...deals, ...tasks].slice(0, 8);
  }, [query, searchData]);

  const notifications = useMemo(() => {
    const overdueTasks = searchData.tasks
      .filter((task) => task.overdue)
      .map((task) => ({
        id: `overdue-task-${task.id}`,
        title: 'Task overdue',
        description: `${task.title} · ${task.customerName}`,
        path: '/tasks',
        tone: 'text-clay'
      }));

    const approvalDeals = searchData.deals
      .filter((deal) => deal.requiresManagerApproval)
      .map((deal) => ({
        id: `approval-deal-${deal.id}`,
        title: 'Manager approval needed',
        description: `${deal.name} · ${deal.customerName}`,
        path: '/deals',
        tone: 'text-pine'
      }));

    const highValueDeals = searchData.deals
      .filter((deal) => Number(deal.amount) > 10000 && !deal.requiresManagerApproval)
      .map((deal) => ({
        id: `high-value-deal-${deal.id}`,
        title: 'High-value deal active',
        description: `${deal.name} · ${deal.stage}`,
        path: '/deals',
        tone: 'text-moss'
      }));

    return [...overdueTasks, ...approvalDeals, ...highValueDeals].slice(0, 6);
  }, [searchData]);

  const selectSearchResult = (result) => {
    setQuery('');
    setIsSearchOpen(false);
    navigate(result.path);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter' && searchResults[0]) {
      selectSearchResult(searchResults[0]);
    }
    if (event.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-cream/80 px-4 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink shadow-card lg:hidden" type="button" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="relative hidden max-w-xl flex-1 md:block" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
          <input
            className="h-12 w-full rounded-2xl border border-white bg-white/80 pl-11 pr-4 text-sm font-semibold text-ink outline-none ring-pine/20 transition placeholder:text-ink/35 focus:ring-4"
            placeholder="Search customers, deals, tasks..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsSearchOpen(true);
              loadSearchData();
            }}
            onFocus={() => {
              setIsSearchOpen(true);
              loadSearchData();
            }}
            onKeyDown={handleSearchKeyDown}
            type="search"
          />
          {isSearchOpen && query.length > 0 && (
            <div className="absolute left-0 right-0 top-14 z-30 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-soft">
              {query.length < 2 && <p className="px-4 py-3 text-sm font-bold text-ink/45">Type at least 2 characters.</p>}
              {query.length >= 2 && searchError && <p className="px-4 py-3 text-sm font-bold text-clay">{searchError}</p>}
              {query.length >= 2 && !searchError && searchResults.length === 0 && <p className="px-4 py-3 text-sm font-bold text-ink/45">No results found.</p>}
              {searchResults.map((result) => (
                <button
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-cream"
                  key={result.id}
                  type="button"
                  onClick={() => selectSearchResult(result)}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-ink">{result.title}</span>
                    <span className="block truncate text-xs font-bold text-ink/45">{result.subtitle}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-pine/10 px-2.5 py-1 text-xs font-extrabold text-pine">{result.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative" ref={notificationRef}>
            <button className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink shadow-card transition hover:text-pine" type="button" onClick={openNotifications} aria-label="Notifications">
              <Bell size={18} />
              {notifications.length > 0 && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-clay ring-2 ring-white" />}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 top-14 z-30 w-80 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-soft">
                <div className="border-b border-ink/5 px-4 py-3">
                  <p className="text-sm font-extrabold text-ink">Notifications</p>
                  <p className="text-xs font-bold text-ink/45">CRM alerts from deals and tasks</p>
                </div>
                {notifications.length ? (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-cream"
                        key={notification.id}
                        type="button"
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigate(notification.path);
                        }}
                      >
                        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-current ${notification.tone}`} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-extrabold text-ink">{notification.title}</span>
                          <span className="block truncate text-xs font-bold text-ink/45">{notification.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-4 text-sm font-bold text-ink/45">No active CRM alerts.</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-card">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-pine font-display text-sm font-bold text-cream">{user?.name?.slice(0, 2).toUpperCase() || 'SF'}</div>
            <div className="hidden sm:block">
              <p className="text-sm font-extrabold text-ink">{user?.name || 'Sales Flow'}</p>
              <p className="text-xs font-bold text-ink/45">{user?.role || 'User'}</p>
            </div>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink shadow-card transition hover:text-clay" type="button" onClick={logout} aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
