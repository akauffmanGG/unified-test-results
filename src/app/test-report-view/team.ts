export interface Team {
    readonly displayName: string;
    readonly developmentLabel: string;
}

class TeamInstance implements Team {
    readonly displayName: string;
    readonly developmentLabel: string;

    constructor(_displayName: string, _developmentLabel: string) {
        this.displayName = _displayName;
        this.developmentLabel = _developmentLabel;
    }
}

export const BlueTeam = new TeamInstance('Blue', 'blue_team');
export const LaserLemonTeam = new TeamInstance('Laser Lemon', 'laser_lemon_team');
export const IndigoTeam = new TeamInstance('Indigo', 'indigo_team');
export const PeachPuffTeam = new TeamInstance('Peach Puff', 'peach_puff_team');
export const MissingTeam = new TeamInstance('None', 'missing_delivery_team');
export const Teams: Team[] = [BlueTeam, LaserLemonTeam, IndigoTeam, PeachPuffTeam, MissingTeam];
