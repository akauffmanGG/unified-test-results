export class JiraIssue {
    private static readonly TEST_CASE_REGEX = new RegExp('TC\\d{5}', 'ig');

    id: number;
    key: string;
    self: string;
    summary: string;
    testCase: string;
    testCases: string[] = [];
    statusName: string = '';
    assigneeDisplayName: string = '';

    constructor(obj: any) {
        this.id = obj.id;
        this.key = obj.key;
        this.self = obj.self;
        this.summary = obj.fields.summary;
        this.statusName = obj.fields.status.name;

        if(obj.fields.assignee) {
            this.assigneeDisplayName = obj.fields.assignee.displayName;
        }

        let match;
        while((match = JiraIssue.TEST_CASE_REGEX.exec(obj.fields.customfield_10073)) != null) {
            this.testCases.push(match[0]);
        }

    }
}
