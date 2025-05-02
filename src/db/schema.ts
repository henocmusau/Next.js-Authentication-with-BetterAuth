
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, integer, uuid, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    twoFactorEnabled: boolean('two_factor_enabled'),
    username: text('username').unique(),
    displayUsername: text('display_username'),
    role: text('role'),
    banned: boolean('banned'),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires')
});

export const session = pgTable("session", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text('active_organization_id'),
    impersonatedBy: text('impersonated_by')
});

export const account = pgTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const organization = pgTable("organization", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique(),
    logo: text('logo'),
    createdAt: timestamp('created_at').notNull(),
    metadata: text('metadata')
});

export const member = pgTable("member", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    createdAt: timestamp('created_at').notNull()
});

export const invitation = pgTable("invitation", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role'),
    status: text('status').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const twoFactor = pgTable("two_factor", {
    id: text('id').primaryKey(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const oauthApplication = pgTable("oauth_application", {
    id: text('id').primaryKey(),
    name: text('name'),
    icon: text('icon'),
    metadata: text('metadata'),
    clientId: text('client_id').unique(),
    clientSecret: text('client_secret'),
    redirectURLs: text('redirect_u_r_ls'),
    type: text('type'),
    disabled: boolean('disabled'),
    userId: text('user_id'),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const oauthAccessToken = pgTable("oauth_access_token", {
    id: text('id').primaryKey(),
    accessToken: text('access_token').unique(),
    refreshToken: text('refresh_token').unique(),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    clientId: text('client_id'),
    userId: text('user_id'),
    scopes: text('scopes'),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const oauthConsent = pgTable("oauth_consent", {
    id: text('id').primaryKey(),
    clientId: text('client_id'),
    userId: text('user_id'),
    scopes: text('scopes'),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
    consentGiven: boolean('consent_given')
});


// ----- Table Messages (Notre table principale pour le chat) -----
// export const messages = pgTable('messages', {
//     id: uuid('id').defaultRandom().primaryKey(), // UUID comme clé primaire
//     content: text('content').notNull(), // Contenu du message
//     userId: text('id').notNull().references(() => user.id, { onDelete: 'restrict' }), // Clé étrangère vers l'utilisateur qui a envoyé le message
//     // onDelete: 'restrict' -> Empêche la suppression d'un user s'il a des messages.
//     // Alternative: 'set null' -> Garde le message mais le rend anonyme si l'user est supprimé.
//     // Alternative: 'cascade' -> Supprime les messages de l'user s'il est supprimé.
//     createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
// }, (table) => {
//     return {
//         userIdIdx: index('messages_userId_idx').on(table.userId), // Index pour retrouver les messages d'un user
//         createdAtIdx: index('messages_createdAt_idx').on(table.createdAt), // Index pour trier/filtrer par date efficacement
//     };
// });

// ----- Définition des Relations (Pour Drizzle Kit / Querying) -----

export const usersRelations = relations(user, ({ many }) => ({
    accounts: many(account), // Un utilisateur peut avoir plusieurs comptes (OAuth, etc.)
    sessions: many(session), // Un utilisateur peut avoir plusieurs sessions actives
    // messages: many(messages), // Un utilisateur peut envoyer plusieurs messages
}));

export const accountsRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }), // Un compte appartient à un utilisateur
}));

export const sessionsRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }), // Une session appartient à un utilisateur
}));

// export const messagesRelations = relations(messages, ({ one }) => ({
//     author: one(user, { // Renommé 'author' pour la clarté côté message
//         fields: [messages.userId],
//         references: [user.id],
//     }), // Un message a un auteur (utilisateur)
// }));

