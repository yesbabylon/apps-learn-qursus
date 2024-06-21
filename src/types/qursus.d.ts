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
