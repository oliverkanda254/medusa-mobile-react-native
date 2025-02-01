export type FulfillmentStatus =
  | 'canceled'
  | 'not_fulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'partially_shipped'
  | 'shipped'
  | 'partially_delivered'
  | 'delivered';

export const getFulfillmentStatus = (status: FulfillmentStatus) => {
  const statusMap: Record<FulfillmentStatus, string> = {
    canceled: 'Canceled',
    not_fulfilled: 'Not Fulfilled',
    partially_fulfilled: 'Partially Fulfilled',
    fulfilled: 'Fulfilled',
    partially_shipped: 'Partially Shipped',
    shipped: 'Shipped',
    partially_delivered: 'Partially Delivered',
    delivered: 'Delivered',
  };

  return statusMap[status] || 'Not Fulfilled';
}; 