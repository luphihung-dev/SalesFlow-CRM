export const CRM_SEARCH_REFRESH_EVENT = 'crm-search-refresh';

export const notifySearchDataChanged = () => {
  window.dispatchEvent(new Event(CRM_SEARCH_REFRESH_EVENT));
};
