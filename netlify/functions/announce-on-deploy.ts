import { announceReadyDeploy } from "./_shared/announce";
import { httpsOrigin } from "./_shared/payload";

type DeploySucceededEvent = {
  deploy: {
    id: string;
    state: string;
    context: string;
    sslUrl: string | null;
    url: string | null;
  };
  site: {
    url: string;
  };
};

/** Runs inside the deploy, so a production publish announces even if the outgoing webhook does not call /api/notify. */
export default {
  async deploySucceeded(event: DeploySucceededEvent) {
    const deploy = event.deploy;
    console.log(`announce-on-deploy id=${deploy.id} context=${deploy.context} state=${deploy.state}`);
    if (deploy.context !== "production" || deploy.state !== "ready") return;

    const origin = httpsOrigin(deploy.sslUrl) ?? httpsOrigin(deploy.url) ?? httpsOrigin(event.site.url);
    if (!origin) {
      console.error("announce-on-deploy missing url");
      return;
    }

    try {
      const result = await announceReadyDeploy(origin);
      console.log(
        `announce-on-deploy sent=${result.sent.join(",") || "none"} discord=${result.discord.join(",") || "none"}`
      );
    } catch (error) {
      console.error("announce-on-deploy failed:", error instanceof Error ? error.message : "unknown");
    }
  }
};
