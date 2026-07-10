const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readline = require('readline');

puppeteer.use(StealthPlugin());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  console.log('🚀 BOT GENPLAY - GITPOD');
  console.log('====================================');

  const email = await ask('📧 Email: ');
  const password = await ask('🔑 Mật khẩu: ');
  const tiktok = await ask('📱 Link TikTok: ');
  const youtube = await ask('🎬 Link YouTube: ');
  const discord = await ask('💬 Discord (bỏ qua nếu không cần): ') || '';
  const country = await ask('🌍 Quốc gia (bỏ qua nếu không cần): ') || '';
  rl.close();

  console.log('\n⏳ Đang khởi động trình duyệt ảo...');

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=414,896'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 });
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36');

  console.log('🌐 Đang truy cập https://creator.genplay.io...');
  await page.goto('https://creator.genplay.io/', { waitUntil: 'networkidle2', timeout: 30000 });

  console.log('⏳ Đang đăng nhập...');
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
  await page.type('input[type="email"], input[name="email"]', email);
  await page.type('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"], button:has-text("Đăng nhập"), button:has-text("Login")');

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
  console.log('✅ Đăng nhập thành công!');

  console.log('⏳ Đang tìm form nhập thông tin...');
  try {
    await page.waitForSelector('input[placeholder*="TikTok"], input[name*="tiktok"]', { timeout: 15000 });
    console.log('✅ Tìm thấy form! Đang điền...');

    await page.click('input[placeholder*="TikTok"], input[name*="tiktok"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.type('input[placeholder*="TikTok"], input[name*="tiktok"]', tiktok);

    await page.click('input[placeholder*="YouTube"], input[name*="youtube"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.type('input[placeholder*="YouTube"], input[name*="youtube"]', youtube);

    if (discord) {
      await page.click('input[placeholder*="Discord"], input[name*="discord"]');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.type('input[placeholder*="Discord"], input[name*="discord"]', discord);
    }

    if (country) {
      await page.click('input[placeholder*="Quốc gia"], input[name*="country"]');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.type('input[placeholder*="Quốc gia"], input[name*="country"]', country);
    }

    console.log('⏳ Đang lưu thông tin...');
    await page.click('button:has-text("LƯU THÔNG TIN"), button:has-text("Lưu"), button[type="submit"]');
    await page.waitForTimeout(3000);
    console.log('🎉 ĐÃ LƯU THÔNG TIN THÀNH CÔNG!');

    await page.screenshot({ path: 'ketqua.png', fullPage: true });
    console.log('📸 Đã chụp ảnh kết quả: ketqua.png');

  } catch (error) {
    console.log('⚠️ Không tìm thấy form, chụp ảnh để kiểm tra...');
    await page.screenshot({ path: 'ketqua.png', fullPage: true });
    console.log('📸 Đã chụp ảnh: ketqua.png');
  }

  console.log('\n⏳ Bot sẽ tự động đóng sau 10 giây...');
  await page.waitForTimeout(10000);
  await browser.close();
  console.log('✅ Bot hoàn thành!');
})();
