# Assets và giấy phép

Không có tài sản nào được lấy từ Likova. Ảnh tham khảo chỉ dùng quan sát trong thư mục QA local, không commit và không nhúng vào website.

| File trong `public/` | Nguồn | Quyền / giới hạn |
| --- | --- | --- |
| `images/exterior.webp`, `images/structure.webp` | Render trực tiếp mô hình procedural do dự án viết trong `src/architecture.ts` bằng Three.js | Nội dung gốc của dự án; không phải công trình đã được xây dựng. Có thể tái tạo bằng `node scripts/render-assets.mjs` khi dev server chạy. |
| `images/arrival.webp` | Built-in imagegen, file gốc `exec-4679a581-5926-41ac-8afb-130e2a160ef2.png` | Hình ảnh AI của concept LAVA, không phải ảnh chụp dự án thực. Phối cảnh diễn giải ý tưởng, không phải bản vẽ BIM khớp từng chi tiết với mô hình WebGL. |
| `images/lounge.webp` | Built-in imagegen, `exec-fa6c270f-b805-40b5-8cbd-a3886af3e4d3.png` | Hình ảnh AI của không gian concept. |
| `images/terrace.webp` | Built-in imagegen, `exec-727b6493-8186-44e3-9d93-682fd4a376fc.png` | Hình ảnh AI của không gian concept. |
| `favicon.svg` | Wordmark hình học gốc của LAVA | SVG đơn giản, không lấy logo bên thứ ba. |
| Manrope, bốn weight Latin 400/500/600/700 | `@fontsource/manrope`, Manrope Project Authors | SIL Open Font License 1.1; bản license trong `public/licenses/Manrope-OFL.txt`. Nội dung hiện tại tiếng Anh, chỉ tải Latin cần thiết; thêm subset Vietnamese nếu chuyển ngôn ngữ. |
| Three.js | `three` package, Three.js authors | MIT; `public/licenses/Three-MIT.txt`. |

Các ảnh AI được tạo bằng công cụ built-in, không dùng CLI/API key, sau đó chuyển PNG sang WebP để giảm dung lượng. Việc tạo ảnh không cung cấp bảo đảm độc quyền hình ảnh hoặc đăng ký nhãn hiệu. Không có asset stock, mô hình GLB hay font thương mại không rõ giấy phép.

## Prompt set của imagegen

### Lounge

Use case: stylized-concept. Create one photorealistic architectural visualization for the original LAVA premium architectural concept, wide landscape 3:2 aspect ratio. A monumental double-height contemporary gallery lounge, exposed charcoal board-formed concrete ceiling with very slim warm recessed strip lights, tall bronze vertical mullions and floor-to-ceiling glass on the right overlooking a still reflective pool at blue hour. Low sculptural cream stone benches, one black leather lounge chair, pale travertine floor, a warm bronze monolithic reception block deep in the background, restrained greenery outside. Strong long perspective and asymmetrical architectural editorial framing. Realistic material grain, sophisticated indirect amber lighting balanced with cool midnight blue exterior, subtle shadows, cinematic but physically credible, Architectural Digest level architectural photograph shot on medium format 24mm. NO text, NO logos, NO watermark, NO people. This is a conceptual interior visualization, not an existing or famous building.

### Terrace

Use case: stylized-concept. One photorealistic architectural visualization of an original LAVA outdoor roof terrace. Wide landscape 3:2. Contemporary monumental horizontal cantilevered concrete architecture with slim bronze vertical facade fins to the left. Looking along a deep open terrace from beneath a charcoal board-formed concrete overhang. Warm amber recessed linear ceiling lights, floor-to-ceiling glass reflecting the evening, a sculptural pale travertine bench, dense restrained ornamental grasses in thin dark rectangular planters on right. Long deep perspective opening to quiet blue hour sky and dark distant trees. Premium minimalist material palette, navy shadows, warm light, silver gray stone, realistic fine texture, physically credible architectural photograph on medium format. Elegant, calm, cinematic. No text, no watermark, no logos, no people. Original conceptual building, not an existing or famous work.

### Exterior

Use case: stylized-concept. Original LAVA architectural visualization. Cinematic photorealistic 3:2 landscape editorial exterior photograph at blue hour, a premium contemporary six-storey building made of six strongly horizontal cantilevered charcoal concrete slabs, each upper storey stepping back slightly to form planted terraces. Slim closely spaced vertical bronze fins and floor to ceiling dark glass, warm interior lighting glowing behind glass, fine warm linear illumination under slab edges. Building raised on slender bronze pilotis, broad pale stone steps at entry, shallow reflecting pool in foreground. Upper volumes shift slightly asymmetrically toward right, elegant modern geometric silhouette. Low three-quarter camera view with entire building visible, dramatic midnight blue sky, quiet dark landscaped surroundings, no city skyline, no other buildings. Concrete rough texture and realistic glass reflections, subtle vegetation, warm and cool light in balanced contrast, museum quality, physically accurate architectural photography, not toy model, not cartoon, not illustration. No text, no logo, no watermark, no people. This is an original hypothetical architectural concept not a real development.
