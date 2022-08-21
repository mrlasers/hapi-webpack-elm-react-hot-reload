module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)


type Msg
    = NoMsg
    | UpdateText String


type alias Model =
    { text : String
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateText newText ->
            ( { model | text = newText }, Cmd.none )

        NoMsg ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    section []
        [ nav []
            [ h1 [] [ text "Elm App" ]
            , input [ type_ "text", onInput UpdateText, value model.text ] []
            ]
        , div []
            [ p [] [ text "This is a little Elm app running in our page. It does hot reloading and all that jazz." ]
            , p [] [ text "The End." ]
            , p [] [ text model.text ]
            , p [] [ text "This should not clear that text input." ]
            ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> ( { text = "" }, Cmd.none )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
