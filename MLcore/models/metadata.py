from dataclasses import dataclass
from typing import Optional
import numpy as np

@dataclass
class GameFeatures:
    """ 
        Features from a single historical game for a team. 

        author: Noah (foo-7)
        version: 11/05/2025
    """
    game_id: str
    team: str
    opponent: str
    season: int
    week: int

    off_epa: float
    pass_epa: float
    rush_epa: float
    air_epa: float
    yac_epa: float

    def_epa: float
    def_pass_epa: float
    def_rush_epa: float

    success_rate: float
    explosiveness: float
    third_down_conversion: float
    red_zone: float

    turnovers_lost: float
    turnovers_forced: float
    turnovers_margin: float

    completion_rate: float
    sack_rate: float
    qb_hit_rate: float
    avg_depth_of_target: float

    rush_rate: float
    yards_per_carry: float
    stuff_rate: float

    penalties: int
    penalty_yards: int

    total_plays: int
    time_possession_pct: float

    point_diff: int
    won: bool
    was_home: bool

    opponent_season_epa: float

    def to_vector(self) -> np.ndarray:
        return np.array([
            self.off_epa,
            self.pass_epa,
            self.rush_epa,
            self.air_epa,
            self.yac_epa,
            self.def_epa,
            self.def_pass_epa,
            self.def_rush_epa,
            self.success_rate,
            self.explosiveness,
            self.third_down_conversion,
            self.red_zone,
            self.turnovers_lost,
            self.turnovers_forced,
            self.turnovers_margin,
            self.completion_rate,
            self.sack_rate,
            self.qb_hit_rate,
            self.avg_depth_of_target,
            self.rush_rate,
            self.yards_per_carry,
            self.stuff_rate,
            self.penalties,
            self.penalty_yards,
            self.total_plays,
            self.time_possession_pct,
            self.opponent_season_epa
        ])
    
    @staticmethod
    def feature_names() -> list[str]:
        return [
            "off_epa",
            "pass_epa",
            "rush_epa",
            "air_epa",
            "yac_epa",
            "def_epa",
            "def_pass_epa",
            "def_rush_epa",
            "success_rate",
            "explosiveness",
            "third_down_conversion",
            "red_zone",
            "turnovers_lost",
            "turnovers_forced",
            "turnovers_margin",
            "completion_rate",
            "sack_rate",
            "qb_hit_rate",
            "avg_depth_of_target",
            "rush_rate",
            "yards_per_carry",
            "stuff_rate",
            "penalties",
            "penalty_yards",
            "total_plays",
            "time_possession",
            "opponent_season_epa"
        ]
    
@dataclass
class StaticFeatures:
    """
        Features for specific upcoming matchup 

        author: Noah (foo-7)
        version: 11/05/2025
    """

    home_field: bool
    is_division_game: bool
    is_conference_game: bool
    is_primetime: bool
    week_number: int

    rest_days_home: int
    rest_days_away: int
    travel_distance_miles: Optional[float]
    timezone_change: Optional[int]

    temperature: Optional[float]
    wind_speed: Optional[float]
    humidity: Optional[float]
    is_dome: bool
    precipitation: Optional[str]

    surface_type: str # grass or turf
    stadium_neutral: bool
    altitude_feet: Optional[float]

    spread_line: float
    total_line: float
    opening_spread: Optional[float]
    spread_movement: Optional[float]

    vegas_implied_win_pct_home: float
    vegas_implied_win_pct_away: float

    home_wins: int
    home_losses: int
    away_wins: int
    away_losses: int
    home_win_pct: float
    away_win_pct: float

    playoff_probability_home: Optional[float]
    playoff_probability_away: Optional[float]
    
    def to_vector(self) -> np.ndarray:
        return np.array([
            float(self.home_field),
            float(self.is_division_game),
            float(self.is_conference_game),
            float(self.is_primetime),
            self.week_number / 18.0,
            self.rest_days_home,
            self.rest_days_away,
            self.travel_distance_miles or 0,
            self.timezone_change or 0,
            self.temperature or 70,
            self.wind_speed or 0,
            self.humidity or 50,
            float(self.is_dome),
            self.__encode_surface(self.surface_type),
            float(self.stadium_neutral),
            self.altitude_feet or 0,
            self.spread_line,
            self.total_line,
            self.opening_spread or 0,
            self.spread_movement or 0,
            self.vegas_implied_win_pct_home,
            self.home_win_pct,
            self.away
        ])
    
@dataclass
class TeamGameSequence:
    """
        This class is used for the transformer model 
    
        author: Noah (foo-7)
        version: 11/05/2025
    """
    team: str
    games: list[GameFeatures]
    sequence_length: int = 5

    def to_matrix(self) -> np.ndarray:
        while len(self.games) < self.sequence_length:
            self.games.insert(0, self.__create_neutral_game())

        recent_games = self.games[-self.sequence_length:]
        return np.vstack([game.to_vector() for game in recent_games])
    
    def __create_neutral_game(self) -> GameFeatures:
        return GameFeatures(
            game_id='padding',
            team=self.team,
            opponent='unknown',
            season=0,
            week=0,
            off_epa=0.0,
            pass_epa=0.0,
            rush_epa=0.0,
            air_epa=0.0,
            yac_epa=0.0,
            def_epa=0.0,
            def_pass_epa=0.0,
            def_rush_epa=0.0,
            success_rate=0.5,
            explosiveness=0.15,
            third_down_conversion=0.33,
            red_zone=0.5,
            turnovers_lost=1,
            turnovers_forced=1,
            turnovers_margin=0,
            completion_rate=0.6,
            sack_rate=0.05,
            qb_hit_rate=0.1,
            avg_depth_of_target=7.0,
            rush_rate=0.4,
            yards_per_carry=4.0,
            stuff_rate=0.1,
            penalties=5,
            penalty_yards=50,
            total_plays=60,
            time_possession_pct=0.5,
            point_diff=0,
            won=False,
            was_home=False,
            opponent_season_epa=0.0
        )
    
@dataclass
class NFLGameSample:
    """
        Complete training sample for one game prediction, used for both training and inference 

        author: Noah (foo-7)
        version: 11/05/2025
    """

    game_id: str
    home_team: str
    away_team: str
    season: int
    week: int
    gameday: str

    home_sequence: TeamGameSequence
    away_sequence: TeamGameSequence
    static_features: StaticFeatures

    actual_home_won: bool
    vegas_home_win_prob: float

    def get_training_data(self) -> tuple:
        return (self.home_sequence.to_matrix(), self.away_sequence.to_matrix(), self.static_features.to_vector(), float(self.actual_home_won))
    
    def get_vegas_baseline(self) -> float:
        return self.vegas_home_win_prob
    
    def calculate_edge(self, model_pred: float) -> float:
        return model_pred - self.vegas_home_win_prob
    
@dataclass
class XGBoostMetaFeatures:
    """ TBD """
    pass