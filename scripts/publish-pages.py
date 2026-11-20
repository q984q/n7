"""Export the real Next.js storefront without packaging server code or production secrets."""
from pathlib import Path
import tempfile, shutil, subprocess, os, re
root = Path(__file__).resolve().parents[1]
app = root / 'n7-construction'
with tempfile.TemporaryDirectory() as temp:
    stage = Path(temp)
    for filename in ['package.json','tsconfig.json','tailwind.config.ts','postcss.config.mjs','next-env.d.ts']:
        shutil.copy(app/filename, stage/filename)
    for name in ['src','public']:
        shutil.copytree(app/name, stage/name)
    (stage/'node_modules').symlink_to(app/'node_modules', target_is_directory=True)
    src = stage/'src'; routes = src/'app'
    shutil.rmtree(routes/'api'); shutil.rmtree(routes/'admin')
    (stage/'next.config.mjs').write_text('export default {output:"export", basePath:"/n7", trailingSlash:true, images:{unoptimized:true}};\n')
    for f in src.rglob('*'):
        if f.suffix not in ['.ts','.tsx','.css']: continue
        s=f.read_text().replace('/images/', '/n7/images/').replace('https://n7construction.kz','https://q984q.github.io/n7')
        if f == routes/'contacts/page.tsx': s=s.replace('"force-dynamic"','"force-static"')
        if f.name in ['manifest.ts','sitemap.ts','robots.ts']: s+='\nexport const dynamic = "force-static";\n'
        if f.name=='manifest.ts': s=s.replace('start_url: "/"','start_url: "/n7/"').replace('src: "/icon.svg"','src: "/n7/icon.svg"')
        if f == routes/'catalog/page.tsx': s=s.replace('const filters = await searchParams;', 'const filters: {q?: string; sport?: string} = {};')
        if f.name=='StoreContext.tsx': s=s.replace('    refreshCms();','    // Static edition uses bundled public catalog.');
        if f.name=='Footer.tsx': s=re.sub(r'<Link href="/admin".*?</Link>','',s,flags=re.S)
        if 'onSubmit={handleSubmit}' in s:
            s=re.sub(r'<form\b[^>]*onSubmit=\{handleSubmit\}[^>]*>.*?</form>', '<div role="note" className="rounded-2xl bg-canvas p-5 text-sm text-ink">Онлайн-приём заявок на GitHub Pages недоступен. Выбранные товары можно сохранить в списке КП на этом устройстве.</div>',s,flags=re.S)
        f.write_text(s)
    subprocess.run([str(app/'node_modules/.bin/next'),'build'],cwd=stage,check=True,env={**os.environ,'NEXT_TELEMETRY_DISABLED':'1'})
    out=stage/'out'; assert (out/'catalog/index.html').exists(); assert not (out/'api').exists()
    shutil.rmtree(root/'docs'); shutil.copytree(out,root/'docs'); (root/'docs/.nojekyll').touch()
