import {QursusMessageEvent} from "./types/qursus";

/**
 * Class for sending messages to the parent window.
 */
export class LearningAppMessage {

    /**
     * Send a message to the parent window.
     *
     * @param data
     */
    public static send(data: QursusMessageEvent): void {
        window.parent.postMessage(data, '*');
    }

    /**
     * Send a message to the parent window for telling that the learning app has received a click event / interaction.
     */
    public static sendLearningClickEvent(): void {
        window.addEventListener('click', (): void => {
            window.parent.postMessage('qursus_click_event', '*');
        })
    }
}