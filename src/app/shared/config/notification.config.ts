export interface NotificationInterface {
  animate: string;
  clickToClose: boolean;
  pauseOnHover: boolean;
  showProgressBar: true;
  timeOut: number;
  position?: string[];
}

export const NotificationOptions: NotificationInterface = {
  animate: 'scale',
  showProgressBar: true,
  pauseOnHover: true,
  clickToClose: true,
  timeOut: 5000,
  position: ['top', 'right']
};
