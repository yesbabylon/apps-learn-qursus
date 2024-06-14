
export enum MessageEventEnum {
    EQ_ACTION_LEARN_NEXT = 'eq_action_learn_next',
    CHAPTER_REMOVED = 'chapter_removed',
    PAGE_REMOVED = 'page_removed',
    CHAPTER_PROGRESSION_FINISHED = 'chapter_progression_finished',
    MODULE_PROGRESSION_FINISHED = 'module_progression_finished',
}

export type QursusMessageEvent = {
    type: MessageEventEnum;
    data: any;
};


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