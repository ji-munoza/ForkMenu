import { describe, it, expect } from 'vitest';
import {
  formatearRUT,
  validarRUT,
  validarEmail,
  validarPassword,
  validarTexto,
  calcularDescuento,
  formatearPrecio,
} from '../utils/validaciones';

describe('Validaciones de Negocio y Reglas ForkMenu', () => {
  describe('formatearRUT', () => {
    // Convierte un RUN sin formato a puntos y guion.
    it('formatea un RUN sin puntos ni guión al formato con puntos y guión', () => {
      expect(formatearRUT('19011022k')).toBe('19.011.022-K');
      expect(formatearRUT('111111111')).toBe('11.111.111-1');
      expect(formatearRUT('123456785')).toBe('12.345.678-5');
    });

    // Conserva los valores vacíos o de un carácter.
    it('devuelve cadena limpia si tiene 1 carácter o está vacío', () => {
      expect(formatearRUT('')).toBe('');
      expect(formatearRUT('1')).toBe('1');
    });

    // Mantiene el formato de un RUN que ya está escrito correctamente.
    it('limita la entrada a un máximo de 9 caracteres y limpia símbolos no válidos', () => {
      expect(formatearRUT('19.011.022-K')).toBe('19.011.022-K');
    });
  });

  describe('validarRUT', () => {
    // Acepta RUN cuyo dígito verificador es correcto.
    it('valida correctamente RUTs chilenos válidos usando Módulo 11', () => {
      // Este RUN tiene un dígito verificador válido.
      expect(validarRUT('11.111.111-1')).toBe(true);
      // También acepta estos ejemplos válidos.
      expect(validarRUT('111111111')).toBe(true);
      expect(validarRUT('222222222')).toBe(true);
    });

    // Rechaza RUN con dígito incorrecto o incompleto.
    it('rechaza RUTs con dígito verificador erróneo o longitud inválida', () => {
      expect(validarRUT('11.111.111-9')).toBe(false);
      expect(validarRUT('123')).toBe(false);
      expect(validarRUT('')).toBe(false);
    });
  });

  describe('validarEmail', () => {
    // Acepta correos de dominios permitidos.
    it('acepta dominios institucionales y comerciales autorizados (@duoc.cl, @profesor.duoc.cl, @gmail.com)', () => {
      expect(validarEmail('alumno@duoc.cl').valido).toBe(true);
      expect(validarEmail('profesor.demo@profesor.duoc.cl').valido).toBe(true);
      expect(validarEmail('cliente.forkmenu@gmail.com').valido).toBe(true);
    });

    // Rechaza dominios no permitidos y correos mal escritos.
    it('rechaza dominios no autorizados como @hotmail.com, @yahoo.com o sin formato', () => {
      expect(validarEmail('persona@hotmail.com').valido).toBe(false);
      expect(validarEmail('usuario@yahoo.es').valido).toBe(false);
      expect(validarEmail('invalido').valido).toBe(false);
      expect(validarEmail('').valido).toBe(false);
    });
  });

  describe('validarPassword', () => {
    // Acepta contraseñas de 4 a 10 caracteres.
    it('acepta contraseñas entre 4 y 10 caracteres', () => {
      expect(validarPassword('1234').valido).toBe(true);
      expect(validarPassword('admin123').valido).toBe(true);
      expect(validarPassword('1234567890').valido).toBe(true);
    });

    // Rechaza contraseñas fuera de ese largo.
    it('rechaza contraseñas con menos de 4 o más de 10 caracteres', () => {
      expect(validarPassword('123').valido).toBe(false);
      expect(validarPassword('12345678901').valido).toBe(false);
      expect(validarPassword('').valido).toBe(false);
    });
  });

  describe('validarTexto', () => {
    // Comprueba el largo mínimo y máximo del texto.
    it('valida longitud de cadenas de texto correctamente', () => {
      expect(validarTexto('Juan', 1, 50, 'El nombre').valido).toBe(true);
      expect(validarTexto('', 1, 50, 'El nombre').valido).toBe(false);
      expect(validarTexto('a'.repeat(51), 1, 50, 'El nombre').valido).toBe(false);
    });
  });

  describe('calcularDescuento', () => {
    // Calcula un descuento porcentual.
    it('calcula descuento porcentual correctamente (20% para FORK20)', () => {
      const cuponPorcentaje = { tipo: 'porcentaje', valor: 0.20 };
      expect(calcularDescuento(10000, cuponPorcentaje)).toBe(2000);
      expect(calcularDescuento(25000, cuponPorcentaje)).toBe(5000);
    });

    // Calcula un descuento de monto fijo.
    it('calcula descuento fijo correctamente ($3000 para BIENVENIDA)', () => {
      const cuponFijo = { tipo: 'fijo', valor: 3000 };
      expect(calcularDescuento(10000, cuponFijo)).toBe(3000);
    });

    // Limita el descuento al subtotal.
    it('no permite que el descuento supere el subtotal', () => {
      const cuponFijo = { tipo: 'fijo', valor: 5000 };
      expect(calcularDescuento(2000, cuponFijo)).toBe(2000);
    });

    // No descuenta si no hay cupón o el subtotal es cero.
    it('retorna 0 si el cupón es nulo o el subtotal es 0', () => {
      expect(calcularDescuento(10000, null)).toBe(0);
      expect(calcularDescuento(0, { tipo: 'fijo', valor: 3000 })).toBe(0);
    });
  });

  describe('formatearPrecio', () => {
    // Muestra los precios en pesos chilenos con separador de miles.
    it('formatea montos en pesos chilenos con separador de miles', () => {
      expect(formatearPrecio(8000)).toBe('$8.000');
      expect(formatearPrecio(10500)).toBe('$10.500');
      expect(formatearPrecio(0)).toBe('$0');
    });
  });
});
