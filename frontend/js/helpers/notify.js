import { toast } from 'react-toastify';

export function notify(text, type) {
    if(type === 'success') {
      toast.success(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 8000
      });
    }
    else {
      toast.error(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 8000
      });
    }
}