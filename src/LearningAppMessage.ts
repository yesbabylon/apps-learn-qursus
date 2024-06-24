
export enum MessageEventEnum {
    EQ_ACTION_LEARN_NEXT = 'eq_action_learn_next',
    QU_CHAPTER_REMOVED = 'qu_chapter_removed',
    QU_PAGE_REMOVED = 'qu_page_removed',
    QU_CHAPTER_PROGRESSION_FINISHED = 'qu_chapter_progression_finished',
    QU_MODULE_PROGRESSION_FINISHED = 'qu_module_progression_finished',
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