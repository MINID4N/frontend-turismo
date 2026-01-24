export const VLetras = (texto) => {
   let NomApeRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
   if (NomApeRegex.test(texto)) {
      return true;
   } else {
      return false;
   }
}

export const VLetrasNumeros = (textonum) => {
   let NomApeRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° 0-9]+$/;
   if (NomApeRegex.test(textonum)) {
      return true;
   } else {
      return false;
   }
}

export const VNumero = (numero) => {
   let NumRegex = /^[0-9]+$/;
   if (NumRegex.test(String(numero))) {
      return true;
   } else {
      return false;
   }
}

export const VFecha = (date) => {
   let ExpRegFecha = /^(?:(?:[1-9]\d{3}|0?[1-9]\d{2}|0{1,2}[1-9]\d|0{3}[1-9])[-](?:0?[13578]|1[02])[-](?:31)|(?:[1-9]\d{3}|0?[1-9]\d{2}|0{1,2}[1-9]\d|0{3}[1-9])[-](?:0?[1-9]|1[0-2])[-](?:29|30)|(?:[1-9]\d{3}|0?[1-9]\d{2}|0{1,2}[1-9]\d|0{3}[1-9])[-](?:0?[1-9]|1[0-2])[-](?:0?[1-9]|1\d|2[0-8])|(?:[1-9]\d{3}|0?[1-9]\d{2}|0{1,2}[1-9]\d|0{3}[1-9])[-]0?2[-]29)$|^(?:(?:(?:(?:[1-9]\d{3})|(?:0?[1-9]\d{2})|(?:0{1,2}[1-9]\d)|(?:0{3}[1-9])))[-]0?2[-](?:29))(?:(?:(?:(?:[02468][048])|(?:[13579][26]))00)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])))$/;
   if (ExpRegFecha.test(date)) {
      return true;
   } else {
      return false;
   }
};