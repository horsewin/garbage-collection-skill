'use strict';

/**
 *
 * @type {{AttributesManager: AttributesManager; AttributesManagerFactory: AttributesManagerFactory; PersistenceAdapter: PersistenceAdapter; DefaultRequestDispatcher: DefaultRequestDispatcher; DefaultErrorMapper: DefaultErrorMapper; ErrorHandler: ErrorHandler; ErrorMapper: ErrorMapper; DefaultHandlerAdapter: DefaultHandlerAdapter; DefaultRequestHandlerChain: DefaultRequestHandlerChain; GenericRequestHandlerChain: GenericRequestHandlerChain; HandlerAdapter: HandlerAdapter; HandlerInput: HandlerInput; RequestHandler: RequestHandler; RequestHandlerChain: RequestHandlerChain; RequestInterceptor: RequestInterceptor; ResponseInterceptor: ResponseInterceptor; DefaultRequestMapper: DefaultRequestMapper; RequestMapper: RequestMapper; RequestDispatcher: RequestDispatcher; ImageHelper: ImageHelper; PlainTextContentHelper: PlainTextContentHelper; ResponseBuilder: ResponseBuilder; ResponseFactory: ResponseFactory; RichTextContentHelper: RichTextContentHelper; TextContentHelper: TextContentHelper; DefaultApiClient: DefaultApiClient; BaseSkillBuilder: BaseSkillBuilder; BaseSkillFactory: BaseSkillFactory; CustomSkillBuilder: CustomSkillBuilder; CustomSkillFactory: CustomSkillFactory; Skill: Skill; SkillBuilders: {custom(): CustomSkillBuilder}; SkillConfiguration: SkillConfiguration}}
 */
const Alexa = require('ask-sdk-core');

/**
 * メッセージ文言定義変数
 */
const MESSAGE = require('message');

/**
 * 応答を組み立てるためのライブラリ
 */
let util = require('util');

/**
 *
 * @type {CustomSkillBuilder}
 */
const skillBuilder = Alexa.SkillBuilders.custom();

/**
 * Lambdaハンドラーの定義
 * @type {LambdaHandler} */
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpHandler,
        ExitHandler,
        GarbageHandler,
        SessionEndedRequestHandler
    )
    .withSkillId(process.env.APP_ID)
    .addErrorHandlers(ErrorHandler)
    .lambda();

/**
 * スキル起動ワードのみの処理
 * @type {{canHandle(*): *, handle(*): *}}
 */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(isWelcome(request.session) + MESSAGE.welcome.speak)
            .reprompt(MESSAGE.welcome.reprompt)
            .getResponse();
    },
};

/**
 * 本体処理
 *
 * ゴミ情報をDynamoDBから取得
 * ひらがなと漢字の両方で検索を行う
 * @type {{canHandle(*): *, handle(*): *}}
 */
const GarbageHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;

        return request.type === 'IntentRequest' && request.intent.name === 'GarbageIntent';
    },
    handle(handlerInput) {
        // requestから値を取得
        // const name = request.intent.// エラーチェック

        // json or DynamoDBから値を取得

        //
        return handlerInput.responseBuilder
            .speak(isWelcome(request.session) + util(MESSAGE.action.speak, "hogehoge", "fugafuga"));
            .getResponse();
    },
};

/**
 * ヘルプ時の処理
 * @type {{canHandle(*): *, handle(*): *}}
 */
const HelpHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(isWelcome(request.session) + MESSAGE.welcome.speak)
            .reprompt(MESSAGE.welcome.reprompt)
            .getResponse();
    },
};

/**
 * 終了時の処理
 * @type {{canHandle(*): *, handle(*): *}}
 */
const ExitHandler = {
    canHandle(handlerInput) {
        const {request} = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent' ||
                request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.exit.speak)
            .getResponse();
    },
};

/**
 * 未設定のIntent時の処理
 * @type {{canHandle(): boolean, handle(*, *): *}}
 */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        return handlerInput.responseBuilder
            .speak(MESSAGE.error.recognition.speak)
            .reprompt(MESSAGE.error.recognition.reprompt)
            .getResponse();
    },
};

const isWelcome = (session) => {
    return session.new ? MESSAGE.welcome.base : "";
};
