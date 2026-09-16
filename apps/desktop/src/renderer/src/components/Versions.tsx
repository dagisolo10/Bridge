import { useState } from "react";

export default function Versions() {
    const [versions] = useState(window.electron.process.versions);

    return (
        <ul className="absolute bottom-7.5 my-auto flex items-center overflow-hidden rounded-[24px] bg-[#202127] px-4 backdrop-blur-xl">
            <li className="border-border float-left block border-r p-5 text-[14px] leading-3.5 opacity-80 last:border-none">Electron v{versions.electron}</li>
            <li className="border-border float-left block border-r p-5 text-[14px] leading-3.5 opacity-80 last:border-none">Chromium v{versions.chrome}</li>
            <li className="border-border float-left block border-r p-5 text-[14px] leading-3.5 opacity-80 last:border-none">Node v{versions.node}</li>
        </ul>
    );
}
