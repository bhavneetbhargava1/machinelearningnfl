import torch
import math

class GeGLU(torch.nn.Module):
    """ 
        Activation function that outperforms ReLU and GELU in transformer models.

        author: Noah (foo-7)
        version: 11/05/2025    
    """
    def __init__(
        self,
        dim_in: int,
        dim_out: int,
        bias: bool = True
    ):
        super().__init__()
        self.projection_gate = torch.nn.Linear(dim_in, dim_out, bias=bias)
        self.projection_value = torch.nn.Linear(dim_in, dim_out, bias=bias)

    def forward(self, x):
        gate = torch.nn.functional.gelu(self.projection_gate(x))
        value = self.projection_value(x)
        return gate * value
    
class GeGLUTransformerEncoderLayer(torch.nn.TransformerEncoderLayer):
    """ 
        Custom transformer encoder layer using GeGLU activation

        author: Noah (foo-7)
        version: 11/05/2025
    """

    def __init__(
        self,
        d_model: int,
        nhead: int,
        dim_feedforward: int = 2048,
        dropout: float = 0.1,
        batch_first: bool = False,
        norm_first: bool = False,
        bias: bool = True,
        device = None,
        dtype = None
    ) -> None:
        super().__init__(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            activation="relu",
            batch_first=batch_first,
            norm_first=norm_first,
            bias=bias,
            device=device,
            dtype=dtype
        )

        del self.linear1, self.dropout, self.linear2, self.activation # Replace with GeGLU components
        self.geglu = GeGLU(d_model, dim_feedforward, bias=bias)
        self.dropout = torch.nn.Dropout(dropout)
        self.linear2 = torch.nn.Linear(dim_feedforward, d_model, bias=bias)

    def ff_block(self, x: torch.Tensor) -> torch.Tensor:
        x = self.geglu(x)
        x = self.dropout(x)
        x = self.linear2(x)
        return x

class NFLPredictionModel(torch.nn.Module):
    """
        Simple transformer model for NFL game outcome prediction 

        author: Noah (foo-7)
        version: 11/05/2025    
    """

    def __init__(
        self,
        n_teams: int = 32,
        n_game_features: int = 27,
        n_static: int = 30,
        d_model: int = 192,
        n_head: int = 8,
        n_layers: int = 4,
        seq_len: int = 5,
        dropout: float = 0.1    
    ) -> None:
        super().__init__()
        self.seq_len = seq_len
        head_dim = d_model // n_head
        assert head_dim * n_head == d_model # ensure d_model is divisible by n_head

        self.team_embeddings = torch.nn.Embedding(n_teams, d_model)
        self.game_projection = torch.nn.Linear(n_game_features, d_model)
        self.static_projection = torch.nn.Sequential(
            torch.nn.Linear(n_static, d_model),
            GeGLU(d_model, d_model),
            torch.nn.Dropout(dropout),
        )

        self.register_buffer("rope_freqs", self.__precompute_freqs(d_model, max_len=seq_len))

        encoder_layer = GeGLUTransformerEncoderLayer()
        self.transformer = torch.nn.TransformerEncoder(encoder_layer, num_layers=n_layers)

        # Maybe do pooling, idk, thinking about it.

        self.head = torch.nn.Sequential(
            torch.nn.Linear(d_model * 2, d_model),
            GeGLU(d_model, d_model),
            torch.nn.Dropout(dropout),
            torch.nn.Linear(d_model, 1)
        )

    def forward(self, home_team_id, away_team_id, home_epa_seq, away_epa_seq, static) -> torch.Tensor:
        """ Forward pass method from torch.nn.Module"""

        """ WIP """
        home = self.team_embeddings(home_team_id)
        away = self.team_embeddings(away_team_id)

        cosine_similarity = torch.nn.functional.cosine_similarity(home.unsqueeze(0), away.unsqueeze(0))

    def __precompute_freqs(
        self,
        dim: int,
        max_len: int = 5,
        theta: float = 10000
    ) -> torch.Tensor:
        """
            Returns a tensor of shape (1, 1, max_len, dim // 2) that contains complex exponentials for rotary embeddings used in
            transformer models. These embeddings help the model to capture positional information in sequences, especially
            for cosine and sine functions.
        """
        t = torch.arange(max_len, dtype=torch.float32)
        freqs = torch.outer(t, torch.arange(0, dim, 2, dtype=torch.float32) / dim)
        freqs = torch.exp(freqs * (-math.log(theta) / dim))
        freqs = torch.polar(torch.ones_like(freqs), freqs)
        return freqs.unsqueeze(0).unsqueeze(0)