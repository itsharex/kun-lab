import type { Message, Conversation, ConversationCreate, ConversationUpdate} from '@/types/index'
import { API_BASE_URL, getAuthHeaders, fetchWithRetry, handleApiResponse } from '../config'

export const chatApi = {
  createConversation: async (data: ConversationCreate = {}): Promise<Conversation> => {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/chat/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: data.title || '新对话',
        model: data.model
      }),
    })
    
    const result = await handleApiResponse<any>(response)
    return {
      conversation_id: result.id,
      title: result.title,
      model: result.model,
      messages: [],
      created_at: result.created_at,
      updated_at: result.updated_at
    }
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await fetchWithRetry(`${API_BASE_URL}/api/chat/conversations`, {
      headers: getAuthHeaders()
    })
    const data = await handleApiResponse<any[]>(response)
    return data.map((conv: any) => ({
      ...conv,
      conversation_id: conv.id,
      messages: conv.messages || []
    }))
  },

  getConversation: async (conversationId: string): Promise<Conversation | null> => {
    try {
      const response = await fetchWithRetry(
        `${API_BASE_URL}/api/chat/conversations/${conversationId}`,
        { headers: getAuthHeaders() }
      )
      const data = await handleApiResponse<any>(response)
      return {
        ...data,
        conversation_id: data.id,
        messages: data.messages || []
      }
    } catch (error) {
      console.error('获取对话失败:', error)
      return null
    }
  },

  saveMessages: async (
    conversationId: string,
    data: ConversationUpdate
  ): Promise<{ success: boolean }> => {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    )
    return handleApiResponse<{ success: boolean }>(response)
  },

  deleteConversation: async (
    conversationId: string
  ): Promise<{ status: string; message: string }> => {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    )
    return handleApiResponse<{ status: string; message: string }>(response)
  },

  clearConversation: async (
    conversationId: string
  ): Promise<{ message: string }> => {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/clear`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    )
    return handleApiResponse<{ message: string }>(response)
  },

  // 更新对话使用的模型
  updateConversationModel: async (
    conversationId: string,
    model: string
  ): Promise<{ message: string }> => {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/model`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ model })
      }
    )
    return handleApiResponse<{ message: string }>(response)
  },

  streamChat: async (
    conversationId: string,
    messages: Message[],
    model: string,
    onMessage: (data: any) => void,
    onError: (error: any) => void,
    onComplete: () => void
  ) => {
    let retryCount = 0
    const maxRetries = 3

    // 构建 WebSocket URL
    const buildWsUrl = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const token = getAuthHeaders().Authorization?.replace('Bearer ', '') ?? ''
      return `${protocol}//${window.location.host}/api/chat/conversations/${conversationId}/stream?token=${encodeURIComponent(token)}`
    }

    // 发送初始载荷
    const sendPayload = (ws: WebSocket) => {
      console.log('WebSocket 连接已建立')
      ws.send(JSON.stringify({ messages, model }))
    }

    // 建立并管理 WebSocket 连接
    const connectWebSocket = (): WebSocket => {
      const ws = new WebSocket(buildWsUrl())

      // 连接打开
      ws.onopen = () => sendPayload(ws)

      // 接收消息
      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (err) {
          console.error('解析消息失败:', err)
          onError(err)
        }
      }

      // 连接关闭
      ws.onclose = (event: CloseEvent) => {
        if (!event.wasClean && retryCount < maxRetries) {
          console.log(`WebSocket 连接关闭，${retryCount + 1}秒后重试...`)
          retryCount++
          setTimeout(connectWebSocket, 1000)
        } else {
          console.log('WebSocket 连接已关闭')
          onComplete()
        }
      }

      // 错误处理
      ws.onerror = (error: Event) => {
        console.error('WebSocket 错误:', error)
        onError(error)
        ws.close()
      }

      return ws
    }

    return connectWebSocket()
  },

  sendMessage: async (
    message: string,
    conversationId: string,
    options: {
      model?: string
      image?: string
    } = {}
  ): Promise<Message> => {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: message,
          model: options.model,
          image: options.image
        })
      }
    )
    return handleApiResponse<Message>(response)
  },

  uploadFile: async (
    file: File,
    conversationId: string
  ): Promise<{ success: boolean; data?: { url: string; content?: string } }> => {
    const formData = new FormData()
    formData.append('file', file)

    // 获取认证头信息
    const headers: Record<string, string> = {}
    const authHeaders = getAuthHeaders()
    
    // 如果有Authorization头，添加到请求中
    if ('Authorization' in authHeaders) {
      headers['Authorization'] = authHeaders['Authorization']
    }

    const response = await fetchWithRetry(
      `${API_BASE_URL}/api/chat/conversations/${conversationId}/upload`,
      {
        method: 'POST',
        headers,
        body: formData
      }
    )
    return handleApiResponse<{ success: boolean; data?: { url: string; content?: string } }>(response)
  },

  // 文档上传接口
  convertDocument: async (file: File, conversationId: string): Promise<{ name: string, content: string, type: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('conversation_id', conversationId)

    // 获取认证头信息
    const headers: Record<string, string> = {}
    const authHeaders = getAuthHeaders()
    
    // 如果有Authorization头，添加到请求中
    if ('Authorization' in authHeaders) {
      headers['Authorization'] = authHeaders['Authorization']
    }

    const response = await fetch(`${API_BASE_URL}/api/doc/convert`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || '文档转换失败')
    }

    const data = await response.json()
    
    // 返回统一格式的数据
    return {
      name: data.name || file.name,
      content: data.content || '',
      type: data.type || file.type || 'text/markdown'
    }
  }
}
