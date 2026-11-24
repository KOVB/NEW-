from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys

W, H = 1280, 1280
S = 2  # supersample
img = Image.new("RGB", (W * S, H * S), "#eaf4fb")
d = ImageDraw.Draw(img)
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz, b=False): return ImageFont.truetype(FB if b else F, sz * S)
def s(*v): return [x * S for x in v]

NAVY, BLUE, CYAN, RED, GREY, WHITE = "#0b2a4a", "#1673c8", "#2bb3e6", "#e53935", "#6b7c8f", "#ffffff"

# background gradient band
for y in range(0, 420 * S):
    t = y / (420 * S)
    c = tuple(int(a + (b - a) * t) for a, b in zip((11, 42, 74), (22, 115, 200)))
    d.line([(0, y), (W * S, y)], fill=c)
# water waves
for i, a in enumerate((60, 40)):
    pts = []
    import math
    for x in range(0, W * S + 1, 8):
        pts.append((x, (380 + i * 25) * S + math.sin(x / (90 * S) + i) * 18 * S))
    pts += [(W * S, 440 * S), (0, 440 * S)]
    d.polygon(pts, fill="#eaf4fb" if i else "#cfe6f6")

d.text(s(64, 54), "WATER HUB  ·  СЕРВІС ОСМОСУ", font=f(26, True), fill="#9fd6f5")
d.text(s(64, 100), "Річний комплект", font=f(76, True), fill=WHITE)
d.text(s(64, 190), "картриджів Raifil для осмосу", font=f(48), fill=WHITE)
d.text(s(64, 262), "Заміна на весь рік · мембрана 50 GPD", font=f(30), fill="#cdeaff")

# -30% badge
bx, by, br = 1080, 190, 120
d.ellipse(s(bx - br, by - br, bx + br, by + br), fill=RED, outline=WHITE, width=6 * S)
d.text(s(bx, by - 18), "−30%", font=f(58, True), fill=WHITE, anchor="mm")
d.text(s(bx, by + 46), "річна ціна", font=f(24, True), fill=WHITE, anchor="mm")

def cartridge(x, y, w, h, body, cap, label, lc=WHITE):
    d.rounded_rectangle(s(x, y, x + w, y + h), radius=16 * S, fill=body, outline="#00000022", width=2 * S)
    d.rounded_rectangle(s(x - 4, y - 10, x + w + 4, y + 22), radius=8 * S, fill=cap)
    d.rounded_rectangle(s(x - 4, y + h - 22, x + w + 4, y + h + 10), radius=8 * S, fill=cap)
    d.rectangle(s(x + w / 2 - 8, y - 26, x + w / 2 + 8, y - 10), fill="#9aa7b4")
    d.text(s(x + w / 2, y + h / 2), label, font=f(22, True), fill=lc, anchor="mm")

def inline(x, y, w, h, body, label):
    d.rounded_rectangle(s(x, y, x + w, y + h), radius=h // 2 * S, fill=body)
    d.rectangle(s(x - 26, y + h / 2 - 7, x, y + h / 2 + 7), fill="#9aa7b4")
    d.rectangle(s(x + w, y + h / 2 - 7, x + w + 26, y + h / 2 + 7), fill="#9aa7b4")
    d.text(s(x + w / 2, y + h / 2), label, font=f(22, True), fill=WHITE, anchor="mm")

# product shelf card
d.rounded_rectangle(s(40, 470, W - 40, 830), radius=28 * S, fill=WHITE)
# 1-2-3
cartridge(80, 555, 74, 200, "#f4f1e8", "#3f7fc1", "PP", NAVY)
cartridge(172, 555, 74, 200, "#2e2e2e", "#3f7fc1", "GAC")
cartridge(264, 555, 74, 200, "#3a3a3a", "#3f7fc1", "CTO")
d.text(s(209, 790), "Нижня трійка 1-2-3", font=f(24, True), fill=NAVY, anchor="mm")
d.rounded_rectangle(s(145, 478, 275, 518), radius=18 * S, fill=BLUE)
d.text(s(210, 498), "× 4 к-ти", font=f(22, True), fill=WHITE, anchor="mm")
# membrane
d.rounded_rectangle(s(420, 600, 700, 690), radius=45 * S, fill="#dfe9f2", outline="#9fb6cc", width=3 * S)
for k in range(9):
    d.line(s(445 + k * 28, 605, 445 + k * 28, 685), fill="#b8cadb", width=3 * S)
d.text(s(560, 645), "RO 50 GPD", font=f(26, True), fill=NAVY, anchor="mm")
d.text(s(560, 790), "Мембрана 50 GAL", font=f(24, True), fill=NAVY, anchor="mm")
d.rounded_rectangle(s(505, 478, 615, 518), radius=18 * S, fill=BLUE)
d.text(s(560, 498), "× 1 шт", font=f(22, True), fill=WHITE, anchor="mm")
# postfilter
inline(800, 560, 170, 56, "#2b2b2b", "POST C")
inline(800, 640, 170, 56, "#2b2b2b", "POST C")
d.text(s(885, 790), "Постфільтр", font=f(24, True), fill=NAVY, anchor="mm")
d.rounded_rectangle(s(830, 478, 940, 518), radius=18 * S, fill=BLUE)
d.text(s(885, 498), "× 2 шт", font=f(22, True), fill=WHITE, anchor="mm")
# mineralizer (optional)
inline(1050, 560, 150, 56, "#2a9bd0", "MINERAL")
inline(1050, 640, 150, 56, "#2a9bd0", "MINERAL")
d.text(s(1125, 790), "Мінералізатор", font=f(24, True), fill=NAVY, anchor="mm")
d.rounded_rectangle(s(1050, 478, 1200, 518), radius=18 * S, fill=CYAN)
d.text(s(1125, 498), "× 2 у MAX", font=f(22, True), fill=WHITE, anchor="mm")

def price_card(x, y, w, h, title, sub, old, new, accent):
    d.rounded_rectangle(s(x, y, x + w, y + h), radius=28 * S, fill=WHITE, outline=accent, width=5 * S)
    d.rounded_rectangle(s(x, y, x + w, y + 70), radius=28 * S, fill=accent)
    d.rectangle(s(x, y + 40, x + w, y + 70), fill=accent)
    d.text(s(x + w / 2, y + 36), title, font=f(34, True), fill=WHITE, anchor="mm")
    yy = y + 92
    for line in sub:
        d.text(s(x + 32, yy), "✓ " + line, font=f(24), fill=NAVY)
        yy += 36
    ot = f"{old:,} грн".replace(",", " ")
    d.text(s(x + 32, y + h - 112), ot, font=f(34), fill=GREY)
    tw = d.textlength(ot, font=f(34)) / S
    d.line(s(x + 28, y + h - 92, x + 36 + tw, y + h - 92), fill=RED, width=4 * S)
    d.text(s(x + 32, y + h - 72), f"{new:,} грн".replace(",", " "), font=f(58, True), fill=RED)
    d.rounded_rectangle(s(x + w - 250, y + h - 110, x + w - 28, y + h - 64), radius=20 * S, fill="#fdecea")
    d.text(s(x + w - 139, y + h - 87), f"економія {old-new:,}".replace(",", " "), font=f(22, True), fill=RED, anchor="mm")

price_card(40, 860, 590, 380, "СТАНДАРТ",
           ["1-2-3 Raifil × 4 (заміна раз на 3 міс.)", "Постфільтр вугільний × 2", "Мембрана Raifil 50 GAL × 1"],
           5310, 3717, BLUE)
price_card(650, 860, 590, 380, "MAX + мінералізація",
           ["Усе зі «Стандарт»", "Мінералізатор Raifil × 2", "Смачна вода з Ca та Mg"],
           6410, 4487, CYAN)

img = img.resize((W, H), Image.LANCZOS)
out = sys.argv[1]
img.save(out, quality=92)
print(out)
