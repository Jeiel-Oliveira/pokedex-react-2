import Swal from 'sweetalert2';
import check from './check';

function closeSwal() {
  Swal.close();
}

const loading = (show) => {

  if(check.isNullUndefined(show)) throw new Error('Passe um valor.')
  if(!check.isBoolean) throw new Error('Passe um valor booleano.')

  if(show) {
    Swal.fire({
      title: 'Carregando!',
      html: 'I will close in <b></b> milliseconds.',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    })
  } else {
    closeSwal();
  }
}

const swal = {
  loading
}

export default swal