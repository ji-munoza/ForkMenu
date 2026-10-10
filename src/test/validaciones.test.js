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
    it('formatea un RUN sin puntos ni guión al formato con puntos y guión', () => {
      expect(formatearRUT('19011022k')).toBe('19.011.022-K');
      expect(formatearRUT('111111111')).toBe('11.111.111-1');
      expect(formatearRUT('123456785')).toBe('12.345.678-5');
    });

    it('devuelve cadena limpia si tiene 1 carácter o está vacío', () => {
      expect(formatearRUT('')).toBe('');
      expect(formatearRUT('1')).toBe('1');
    });

    it('limita la entrada a un máximo de 9 caracteres y limpia símbolos no válidos', () => {
      expect(formatearRUT('19.011.022-K')).toBe('19.011.022-K');
    });
  });

  describe('validarRUT', () => {
    it('valida correctamente RUTs chilenos válidos usando Módulo 11', () => {
      // 11.111.111-1 es válido
      expect(validarRUT('11.111.111-1')).toBe(true);
      // 19.011.022-K: verificador K
      // Calculamos: 19011022 -> DV esperado
      // Probemos con RUTs conocidos
      expect(validarRUT('111111111')).toBe(true);
      expect(validarRUT('222222222')).toBe(true);
    });

    it('rechaza RUTs con dígito verificador erróneo o longitud inválida', () => {
      expect(validarRUT('11.111.111-9')).toBe(false);
      expect(validarRUT('123')).toBe(false);
      expect(validarRUT('')).toBe(false);
    });
  });

  describe('validarEmail', () => {
    it('acepta dominios institucionales y comerciales autorizados (@duoc.cl, @profesor.duoc.cl, @gmail.com)', () => {
      expect(validarEmail('alumno@duoc.cl').valido).toBe(true);
      expect(validarEmail('profesor.demo@profesor.duoc.cl').valido).toBe(true);
      expect(validarEmail('cliente.forkmenu@gmail.com').valido).toBe(true);
    });

    it('rechaza dominios no autorizados como @hotmail.com, @yahoo.com o sin formato', () => {
      expect(validarEmail('persona@hotmail.com').valido).toBe(false);
      expect(validarEmail('usuario@yahoo.es').valido).toBe(false);
      expect(validarEmail('invalido').valido).toBe(false);
      expect(validarEmail('').valido).toBe(false);
    });
  });

  describe('validarPassword', () => {
    it('acepta contraseñas entre 4 y 10 caracteres', () => {
      expect(validarPassword('1234').valido).toBe(true);
      expect(validarPassword('admin123').valido).toBe(true);
      expect(validarPassword('1234567890').valido).toBe(true);
    });

    it('rechaza contraseñas con menos de 4 o más de 10 caracteres', () => {
      expect(validarPassword('123').valido).toBe(false);
      expect(validarPassword('12345678901').valido).toBe(false);
      expect(validarPassword('').valido).toBe(false);
    });
  });

  describe('validarTexto', () => {
    it('valida longitud de cadenas de texto correctamente', () => {
      expect(validarTexto('Juan', 1, 50, 'El nombre').valido).toBe(true);
      expect(validarTexto('', 1, 50, 'El nombre').valido).toBe(false);
      expect(validarTexto('a'.repeat(51), 1, 50, 'El nombre').valido).toBe(false);
    });
  });

  describe('calcularDescuento', () => {
    it('calcula descuento porcentual correctamente (20% para FORK20)', () => {
      const cuponPorcentaje = { tipo: 'porcentaje', valor: 0.20 };
      expect(calcularDescuento(10000, cuponPorcentaje)).toBe(2000);
      expect(calcularDescuento(25000, cuponPorcentaje)).toBe(5000);
    });

    it('calcula descuento fijo correctamente ($3000 para BIENVENIDA)', () => {
      const cuponFijo = { tipo: 'fijo', valor: 3000 };
      expect(calcularDescuento(10000, cuponFijo)).toBe(3000);
    });

    it('no permite que el descuento supere el subtotal', () => {
      const cuponFijo = { tipo: 'fijo', valor: 5000 };
      expect(calcularDescuento(2000, cuponFijo)).toBe(2000);
    });

    it('retorna 0 si el cupón es nulo o el subtotal es 0', () => {
      expect(calcularDescuento(10000, null)).toBe(0);
      expect(calcularDescuento(0, { tipo: 'fijo', valor: 3000 })).toBe(0);
    });
  });

  describe('formatearPrecio', () => {
    it('formatea montos en pesos chilenos con separador de miles', () => {
      expect(formatearPrecio(8000)).toBe('$8.000');
      expect(formatearPrecio(10500)).toBe('$10.500');
      expect(formatearPrecio(0)).toBe('$0');
    });
  });
});
