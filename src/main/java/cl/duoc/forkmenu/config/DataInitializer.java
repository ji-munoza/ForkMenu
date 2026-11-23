package cl.duoc.forkmenu.config;

import cl.duoc.forkmenu.boletas.model.Boleta;
import cl.duoc.forkmenu.boletas.model.DetalleBoleta;
import cl.duoc.forkmenu.boletas.repository.BoletaRepository;
import cl.duoc.forkmenu.catalogo.model.Categoria;
import cl.duoc.forkmenu.catalogo.model.Producto;
import cl.duoc.forkmenu.catalogo.repository.CategoriaRepository;
import cl.duoc.forkmenu.catalogo.repository.ProductoRepository;
import cl.duoc.forkmenu.usuarios.model.Usuario;
import cl.duoc.forkmenu.usuarios.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Carga inicial de categorias, platos y usuarios si la base esta vacia.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final BoletaRepository boletaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoriaRepository categoriaRepository,
                           ProductoRepository productoRepository,
                           UsuarioRepository usuarioRepository,
                           BoletaRepository boletaRepository,
                           PasswordEncoder passwordEncoder) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.boletaRepository = boletaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        inicializarCategoriasYProductos();
        inicializarUsuarios();
        inicializarBoletas();
    }

    private void inicializarCategoriasYProductos() {
        if (categoriaRepository.count() > 0) {
            return;
        }

        Map<String, Categoria> cats = new HashMap<>();
        cats.put("hamburguesas", categoriaRepository.save(new Categoria("hamburguesas", "Hamburguesas artesanales premium")));
        cats.put("pizzas", categoriaRepository.save(new Categoria("pizzas", "Pizzas a la piedra fermentacion lenta")));
        cats.put("postres", categoriaRepository.save(new Categoria("postres", "Postres artesanales y tradicionales")));
        cats.put("bebidas", categoriaRepository.save(new Categoria("bebidas", "Bebidas naturales y refrescantes")));
        cats.put("otros", categoriaRepository.save(new Categoria("otros", "Otras preparaciones")));

        if (productoRepository.count() == 0) {
            productoRepository.save(new Producto(
                    "FM-101",
                    "Hamburguesa Clásica",
                    8000,
                    15,
                    3,
                    "Carne 100% vacuno premium, queso cheddar fundido, lechuga fresca, rodajas de tomate y salsa especial de la casa en suave pan brioche artesanal.",
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                    cats.get("hamburguesas")
            ));

            productoRepository.save(new Producto(
                    "FM-102",
                    "Pizza Margarita",
                    10000,
                    10,
                    2,
                    "Masa artesanal a la piedra fermentada 48 horas, salsa de tomates italianos, abundante queso mozzarella y hojas de albahaca fresca con aceite de oliva virgen.",
                    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
                    cats.get("pizzas")
            ));

            productoRepository.save(new Producto(
                    "FM-103",
                    "Tiramisú Tradizionale",
                    5500,
                    8,
                    2,
                    "Clásico postre italiano con finas capas de bizcocho soletilla bañadas en café espresso tostado, suave crema de mascarpone y espolvoreado de cacao puro.",
                    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
                    cats.get("postres")
            ));

            productoRepository.save(new Producto(
                    "FM-104",
                    "Limonada Natural Menta-Jengibre",
                    3000,
                    25,
                    5,
                    "Refrescante limonada preparada con limones recién exprimidos, toques aromáticos de menta silvestre, jengibre y abundante hielo frappé.",
                    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
                    cats.get("bebidas")
            ));

            productoRepository.save(new Producto(
                    "FM-105",
                    "Hamburguesa Doble Bacon & BBQ",
                    9500,
                    12,
                    3,
                    "Doble medallón de vacuno smash, doble queso cheddar, crujiente tocino ahumado, cebolla caramelizada y salsa barbacoa de la casa.",
                    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
                    cats.get("hamburguesas")
            ));

            productoRepository.save(new Producto(
                    "FM-106",
                    "Pizza Pepperoni Suprema",
                    11500,
                    9,
                    2,
                    "Crujiente masa a la piedra, salsa de tomate Pomodoro, mozzarella premium y doble porción de pepperoni artesanal doradito.",
                    "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
                    cats.get("pizzas")
            ));
        }
    }

    private void inicializarUsuarios() {
        if (usuarioRepository.count() > 0) {
            return;
        }

        usuarioRepository.save(new Usuario(
                "11.111.111-1",
                "Administrador",
                "General",
                "admin@forkmenu.cl",
                passwordEncoder.encode("admin123"),
                "admin",
                "metropolitana",
                "Santiago",
                "Av. Central 100"
        ));

        usuarioRepository.save(new Usuario(
                "22.222.222-2",
                "Vendedor",
                "Demo",
                "vendedor@forkmenu.cl",
                passwordEncoder.encode("vendedor123"),
                "vendedor",
                "metropolitana",
                "Providencia",
                "Av. Providencia 200"
        ));

        usuarioRepository.save(new Usuario(
                "19.011.022-K",
                "Juan",
                "Pérez",
                "juan.perez@duoc.cl",
                passwordEncoder.encode("cliente123"),
                "cliente",
                "metropolitana",
                "Santiago",
                "Calle Los Álamos 456"
        ));
    }

    private void inicializarBoletas() {
        if (boletaRepository.count() > 0) {
            return;
        }

        Producto p1 = productoRepository.findByCodigo("FM-101").orElse(null);
        Producto p4 = productoRepository.findByCodigo("FM-104").orElse(null);

        if (p1 != null && p4 != null) {
            Boleta boleta1 = new Boleta(
                    "FM-1001",
                    null,
                    "Juan Pérez",
                    "juan.perez@duoc.cl",
                    "mesa",
                    "Mesa #4",
                    22000,
                    0,
                    22000,
                    "Entregado"
            );
            boleta1.agregarDetalle(new DetalleBoleta(p1, 2));
            boleta1.agregarDetalle(new DetalleBoleta(p4, 2));
            boletaRepository.save(boleta1);
        }
    }
}
