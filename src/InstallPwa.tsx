import React, { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            console.log("L'événement beforeinstallprompt a été déclenché");
            setSupportsPWA(true);
            setPromptInstall(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        if (!promptInstall) return;

        promptInstall.prompt();

        promptInstall.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("L’utilisateur a installé la PWA");
            } else {
                console.log("L’utilisateur a refusé l’installation");
            }
        });
    };

    if (!supportsPWA) return null;

    return (
        <button
            className="link-button play"
            id="setup_button"
            aria-label="Installer l'application"
            title="Installer l'application"
            onClick={onClick}
        >
            Installer
        </button>
    );
};

export default InstallPWA;